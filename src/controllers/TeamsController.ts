import {Router} from "express";
import {v4 as uuidv4} from 'uuid';
import {Team} from "../database/models/Team";
import {TeamMemberRoleIdentifiers} from "../database/TeamMemberRoleIdentifiers";
import {Types} from "mongoose";

const router = Router();

router.get('/', async (req, res, next) => {
    const teams = await Team.find();

    res.json(teams);
});

router.post('/', async (req, res, next) => {
    try {
        const teamWithMembers = {
            ...req.body,
            inviteCode: uuidv4(),
            members: [
                {user: req.auth.userId, role: Types.ObjectId(TeamMemberRoleIdentifiers.Admin)}
            ]
        };

        const team = await Team.create(teamWithMembers);

        return res.json(team);
    } catch (e) {
        res.status(400).json({success: false, message: e.message});
    }
});

router.patch('/:id', async (req, res, next) => {
    try {
        const providedTeam = {...req.body, members: req.body.members.map((m: any) => ({...m, team: m.teamId}))}

        const team = await Team.findByIdAndUpdate(req.params.id, providedTeam, {new: true});

        return res.json(team);
    } catch (e) {
        res.json({success: false, message: e.message});
    }
});

router.get('/discover/:inviteCode', async (req, res, next) => {
    const team = await Team.findOne({inviteCode: req.params.inviteCode});

    res.json(team);
});

router.get('/invites/:inviteCode', async (req, res, next) => {
    const team = await Team.findOne({inviteCode: req.params.inviteCode});

    const isMemberOfTeam = team.members.some(m => m.user.id === req.auth.userId);

    if (!isMemberOfTeam) {
        await team.updateOne({
            members: [...team.members, {
                user: req.auth.userId,
                role: TeamMemberRoleIdentifiers.Member
            }]
        })
    }

    res.redirect('http://localhost:3000');
});

export default router;