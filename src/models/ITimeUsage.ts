import {ITimeUsageCategory} from "./ITimeUsageCategory";

export interface ITimeUsage {
    id?: number;
    percentage: number;
    categoryId: string;
    category?: ITimeUsageCategory;
}