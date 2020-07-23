import {Router} from "express";
import { v4 as uuidv4 } from 'uuid';
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
                {user: '5f1455eaa69a0c1c257ca9e5',  role: TeamMemberRoleIdentifiers.Admin}
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
        const team = await Team.findByIdAndUpdate(req.params.id, req.body).populate([
            {path: 'members.user', model: 'User'},
            {path: 'members.role', model: 'Role'}
        ]);

        return res.json(team);
    } catch (e) {
        res.json({success: false, message: e.message});
    }
});


export default router;