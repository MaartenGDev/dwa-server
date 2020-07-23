import mongoose, {Document, Schema} from "mongoose";
import {ITeam} from "../../models/ITeam";
import {ITeamMember} from "../../models/ITeamMember";
import {IRole} from "../../models/IRole";

const roleSchema = new mongoose.Schema({
    name: {type: String, required: true},
    canManageTeam: {type: Boolean, required: true},
    canManageRetrospective: {type: Boolean, required: true},
    canViewMemberInsights: {type: Boolean, required: true},
});

const teamMemberSchema = new mongoose.Schema({
    roleId: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    role: {type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true},
});

const schema = new mongoose.Schema({
    name: {type: String, required: true},
    inviteCode: {type: String, required: true},
    members: [teamMemberSchema],
});

roleSchema.set('toJSON', {virtuals: true});
teamMemberSchema.set('toJSON', {virtuals: true});
schema.set('toJSON', {virtuals: true});

export const Role = mongoose.model<IRole>('Role', roleSchema);
export const TeamMember = mongoose.model<ITeamMember>('TeamMember', teamMemberSchema);
export const Team = mongoose.model<ITeam>('Team', schema);

