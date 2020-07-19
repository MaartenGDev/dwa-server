import {Router} from "express";
import {Retrospective} from "../database/models/Retrospective";
import {IdentityMapper} from "../mappers/IdentityMapper";
import {Team} from "../database/models/Team";

const router = Router();

router.get('/', async (req, res, next) => {
    await Team
        .find()
        .populate({
            path: 'members.user',
            model: 'User'
        })
        .populate({
            path: 'members.role',
            model: 'Role'
        })
        .exec((err, teams) => {
            res.json(IdentityMapper.map(teams));
        });
});

router.post('/', async (req, res, next) => {
    try {
        await Team.create(req.body);

        return res.json({success: true});
    } catch (e) {
        res.json({success: true, message: e.message});
    }
});

export default router;