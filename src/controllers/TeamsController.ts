import {Router} from "express";
import {v4 as uuidv4} from 'uuid';
import {Team} from "../database/models/Team";
import {TeamMemberRoleIdentifiers} from "../database/TeamMemberRoleIdentifiers";

const router = Router();

router.get('/', async (req, res, next) => {
    const teams = await Team
        .find()
        .populate([
            {path: 'members.user', model: 'User'},
            {path: 'members.role', model: 'Role'}
        ])
        .exec();

    res.json(teams);
});

router.post('/', async (req, res, next) => {
    try {
        const teamWithMembers = {
            ...req.body,
            inviteCode: uuidv4(),
            members: [
                {user: req.auth.userId, role: TeamMemberRoleIdentifiers.Admin}
            ]
        };

        const team = await (await Team.create(teamWithMembers)).populate([
            {path: 'members.user', model: 'User'},
            {path: 'members.role', model: 'Role'}
        ]).execPopulate();

        return res.json(team);
    } catch (e) {
        res.json({success: false, message: e.message});
    }
});

router.patch('/:id', async (req, res, next) => {
    try {
        const providedTeam = {...req.body, members: req.body.members.map((m: any) => ({...m, team: m.teamId}))}

        const team = await Team.findByIdAndUpdate(req.params.id, providedTeam, {new: true}).populate([
            {path: 'members.user', model: 'User'},
            {path: 'members.role', model: 'Role'}
        ]).exec();

        return res.json(team);
    } catch (e) {
        res.json({success: false, message: e.message});
    }
});

router.get('/discover/:inviteCode', async (req, res, next) => {
    const team = await Team
        .findOne({inviteCode: req.params.inviteCode})
        .populate([
            {path: 'members.user', model: 'User'},
            {path: 'members.role', model: 'Role'}
        ])
        .exec();

    res.json(team);
});

router.get('/invites/:inviteCode', async (req, res, next) => {
    const team = await Team
        .findOne({inviteCode: req.params.inviteCode})
        .populate([
            {path: 'members.user', model: 'User'},
            {path: 'members.role', model: 'Role'}
        ]).exec();

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