import {ITimeUsageCategory} from "./ITimeUsageCategory";

export interface ITeamMemberTimeUsage {
    percentage: number,
    percentageChangePercentage: number,
    category: ITimeUsageCategory
}