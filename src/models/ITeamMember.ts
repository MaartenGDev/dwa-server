import {IUser} from "./IUser";
import {IRole} from "./IRole";
import * as mongoose from "mongoose";

export interface ITeamMember extends mongoose.Document {
    id?: number|string;
    name: string;
    userId: number;
    user: IUser;
    roleId: number;
    role: IRole;
}