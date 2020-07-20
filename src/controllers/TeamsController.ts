import {Router} from "express";
import { v4 as uuidv4 } from 'uuid';
import {IdentityMapper} from "../mappers/IdentityMapper";
import {Team} from "../database/models/Team";

const router = Router();

router.get('/', async (req, res, next) => {
    await Team
        .find()
        .populate([
            {path: 'members.user', model: 'User'},
            {path: 'members.role', model: 'Role'}
        ])
        .exec((err, teams) => {
            res.json(IdentityMapper.map(teams));
        });
});

router.post('/', async (req, res, next) => {
    try {
        const team = (await Team.create({...req.body, inviteCode: uuidv4()})).populate([
            {path: 'members.user', model: 'User'},
            {path: 'members.role', model: 'Role'}
        ]);

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

        return res.json(IdentityMapper.map(team));
    } catch (e) {
        res.json({success: false, message: e.message});
    }
});


export default router;