import mongoose, {Document} from "mongoose";
import {IUser} from "./User";

const teamMemberSchema = new mongoose.Schema({
    roleId: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
});

const schema = new mongoose.Schema({
    name: {type: String, required: true},
    inviteCode: {type: String, required: true},
    members: [teamMemberSchema],
});

interface IMember {
    roleId: string;
    user: IUser
}

interface ITeam {
    name: string,
    inviteCode: string;
    members: IMember[]
}
export const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
export const Team = mongoose.model<ITeam & Document>('Team', schema);
