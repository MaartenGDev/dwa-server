import {IMetric} from "./IMetric";
import {IMetricHistory} from "./IMetricHistory";
import {ITimeUsageCategory} from "./ITimeUsageCategory";
import {ITeamMemberTimeUsage} from "./ITeamMemberTimeUsage";

export interface ITeamMemberInsight {
    userId: string;
    fullName: string;
    latestSprintRating: number;
    latestSprintRatingChangePercentage: number;
    timeUsage: ITeamMemberTimeUsage[];
}