import * as mongoose from "mongoose";

export interface IRole extends mongoose.Document {
    id: number;
    name: string;
    canManageTeam: boolean;
    canManageRetrospective: boolean;
    canViewMemberInsights: boolean;
}