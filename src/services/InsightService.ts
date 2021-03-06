import {Retrospective} from "../database/models/Retrospective";
import {Types} from "mongoose";
import {Evaluation, TimeUsageCategory} from "../database/models/Evaluation";
import {ITimeUsageCategory} from "../models/ITimeUsageCategory";
import {IMetric} from "../models/IMetric";
import {IInsight} from "../models/IInsight";
import {IMetricHistory} from "../models/IMetricHistory";
import {IRetrospective} from "../models/IRetrospective";
import {ITeamMemberInsight} from "../models/ITeamMemberInsight";
import {ITeamMemberTimeUsage} from "../models/ITeamMemberTimeUsage";
import {User} from "../database/models/User";
import {IUser} from "../models/IUser";

export class InsightService {
    public async getInsightForTeam(teamId: string, userId = ''): Promise<IInsight> {
        const retrospectives = (await Retrospective.find({team: teamId}).sort({endDate: 'desc'}).lean());

        const timeUsageCategories = (await TimeUsageCategory.find().lean())
            .reduce((acc: { [key: string]: ITimeUsageCategory }, cur: any) => {
                acc[cur._id] = cur;
                return acc;
            }, {}) as { [key: string]: ITimeUsageCategory };

        const hasActiveUserFilter = userId !== '';
        const retrospectivesWhereUserHasEvaluation = hasActiveUserFilter
            ? (await Evaluation.find({user: userId}).lean()).map(e => e.retrospective.toString())
            : [];

        const retrospectiveIds = retrospectives.map(r => Types.ObjectId((r as any)._id))
            .filter(id => !hasActiveUserFilter || hasActiveUserFilter && retrospectivesWhereUserHasEvaluation.some(retrospectiveId => retrospectiveId === id.toHexString()))

        const customFilters = hasActiveUserFilter
            ? [{
                '$match': {
                    'user': Types.ObjectId(userId)
                }
            }]
            : [];

        const evaluations = hasActiveUserFilter
            ? await Evaluation.find({user: userId})
            : [];

        return {
            metrics: await this.getMetricsForRetrospectives(retrospectiveIds, customFilters, timeUsageCategories),
            evaluations: evaluations,
            history: await this.getMetricHistoryForRetrospectives(retrospectives, retrospectiveIds, customFilters, timeUsageCategories)
        }
    }

    private async getMetricsForRetrospectives(retrospectiveIds: Types.ObjectId[], customFilters: any[], timeUsageCategories: { [id: string]: ITimeUsageCategory }): Promise<IMetric[]> {
        const metricRetrospectiveId = retrospectiveIds[0];

        const rawMetrics = await Evaluation.aggregate([...customFilters, ...[
            {
                '$match': {
                    'retrospective': {
                        '$eq': metricRetrospectiveId
                    }
                }
            },
            {
                '$unwind': {
                    'path': '$timeUsage'
                }
            }, {
                '$replaceRoot': {
                    'newRoot': '$timeUsage'
                }
            }, {
                '$group': {
                    '_id': '$category',
                    'percentage': {
                        '$avg': '$percentage'
                    }
                }
            },
            {
                '$project': {
                    percentage: {
                        $round: ["$percentage", 2]
                    }
                }
            }
        ]]).exec();

        const metrics: IMetric[] = rawMetrics.map((m: any) => ({
            name: timeUsageCategories[m._id].name,
            color: timeUsageCategories[m._id].color,
            formattedValue: `${m.percentage}%`,
            changePercentage: 0,
            increaseIsPositive: true
        }))

        const genericMetrics = await Evaluation.aggregate([...customFilters, ...[
            {
                '$match': {
                    'retrospective': {
                        '$eq': metricRetrospectiveId
                    }
                }
            },
            {
                '$group': {
                    '_id': 0,
                    'sprintRating': {
                        '$avg': '$sprintRating'
                    }
                }
            }, {
                '$project': {
                    'sprintRating': {$round: ['$sprintRating', 2]}
                }
            }, {
                '$addFields': {
                    'name': 'Sprint rating',
                    'color': '#3B4558',
                    'formattedValue': {
                        $round: [{$divide: ['$sprintRating', 10]}, 2]
                    },
                    'changePercentage': 0,
                    'increaseIsPositive': true
                }
            }
        ]]).exec();

        return [...metrics, ...genericMetrics];
    }

    private async getMetricHistoryForRetrospectives(retrospectives: IRetrospective[], retrospectiveIds: Types.ObjectId[], customFilters: any[], timeUsageCategories: { [id: string]: ITimeUsageCategory }): Promise<IMetricHistory> {
        const retrospectiveNames = retrospectives.map(r => (r as any).name);

        const datasets = (await Evaluation.aggregate([...customFilters, ...[
            {
                '$match': {
                    'retrospective': {
                        '$in': retrospectiveIds
                    }
                }
            },
            {
                '$unwind': {
                    'path': '$timeUsage'
                }
            }, {
                '$replaceRoot': {
                    'newRoot': '$timeUsage'
                }
            }, {
                '$group': {
                    '_id': '$category',
                    'percentage': {
                        '$push': {$round: ['$percentage', 2]}
                    }
                }
            }
        ]]).exec()).map((category: any) => ({
            label: timeUsageCategories[category._id].name,
            data: category.percentage,
            color: timeUsageCategories[category._id].color
        }));

        return {
            datasets: datasets,
            labels: retrospectiveNames
        };
    }

    public async getTeamMemberInsights(teamId: string): Promise<ITeamMemberInsight[]> {
        const retrospective = await Retrospective.findOne({team: teamId}).sort({endDate: 'desc'});

        const timeUsageCategoriesById = (await TimeUsageCategory.find())
            .reduce((acc: { [key: string]: ITimeUsageCategory }, cur: any) => {
                acc[cur.id] = cur;
                return acc;
            }, {});

        const usersById = (await User.find())
            .reduce((acc: { [key: string]: IUser }, cur: any) => {
                acc[cur.id] = cur;
                return acc;
            }, {});

        return (await Evaluation.aggregate([
            {
                '$match': {
                    'retrospective': {
                        '$eq': Types.ObjectId(retrospective.id)
                    }
                }
            }, {
                '$unwind': {
                    'path': '$timeUsage'
                }
            }, {
                '$addFields': {
                    'timeUsage.percentageChangePercentage': 0
                }
            }, {
                '$group': {
                    '_id': '$user',
                    'userId': {
                        '$first': '$user'
                    },
                    'latestSprintRating': {
                        '$first': {$divide: ['$sprintRating', 10]}
                    },
                    'latestSprintRatingChangePercentage': {
                        '$first': 0
                    },
                    'timeUsage': {
                        '$push': '$$ROOT.timeUsage'
                    }
                }
            }
        ]).exec()).map((res: any) => {
            res.fullName = usersById[res.userId].fullName
            res.timeUsage = res.timeUsage.map((tu: ITeamMemberTimeUsage) => {
                tu.category = timeUsageCategoriesById[tu.category as string];
                return tu;
            })

            return res;
        });
    }
}