import {IMetric} from "./IMetric";
import {IMetricHistory} from "./IMetricHistory";
import {ITimeUsageCategory} from "./ITimeUsageCategory";
import {ITeamMemberTimeUsage} from "./ITeamMemberTimeUsage";
import {IUserRetrospective} from "./IUserRetrospective";
import {IRetrospective} from "./IRetrospective";

export interface IRatingInsight {
    userId: string;
    fullName: string;
    sprintRating: number;
    sprintRatingExplanation: string;
    retrospective: IRetrospective;
}