import {ITeamMember} from "./ITeamMember";
import * as mongoose from "mongoose";

export interface ITeam extends mongoose.Document {
    id: number|string;
    name: string;
    inviteCode: string;
    members: ITeamMember[];
}