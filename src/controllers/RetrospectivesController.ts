import {Router} from "express";
import {Retrospective} from "../database/models/Retrospective";
import {IdentityMapper} from "../mappers/IdentityMapper";
import {IRetrospectiveReport} from "../models/IRetrospectiveReport";

const router = Router();

router.get('/', async (req, res, next) => {
    Retrospective.find((err, retrospectives) => {
        res.json(IdentityMapper.map(retrospectives));
    });
});

router.get('/:id/report', async (req, res, next) => {
    const retrospective = await Retrospective.findOne({_id: req.params.id});

    const report: IRetrospectiveReport = {
      retrospective,
      comments: [],
      suggestedActions: [],
      suggestedTopics: []
    };

    res.json(report);
});

router.post('/', async (req, res, next) => {
    try {
        await Retrospective.create(req.body);

        return res.json({success: true});
    } catch (e) {
        res.json({success: true, message: e.message});
    }
});

export default router;