import {Router} from "express";
import {Retrospective} from "../database/models/Retrospective";
import {IRetrospectiveReport} from "../models/IRetrospectiveReport";

const router = Router();

router.get('/', async (req, res, next) => {
    const retrospectives = await Retrospective
        .find()
        .populate([
            {path: 'team', model: 'Team'},
        ])
        .exec();

    res.json(retrospectives);
});

router.get('/:id/report', async (req, res, next) => {
    const retrospective = await Retrospective.findOne({_id: req.params.id})
        .populate([
            {path: 'team', model: 'Team'},
        ])
        .exec();

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
        const retrospective = await (await Retrospective.create({...req.body, team: req.body.teamId}))
            .populate([
                {path: 'team', model: 'Team'},
            ]).execPopulate();

        return res.json(retrospective);
    } catch (e) {
        res.json({success: false, message: e.message});
    }
});

router.patch('/:id', async (req, res, next) => {
    const retrospective = await Retrospective.findById(req.params.id).populate([
        {path: 'team', model: 'Team'},
    ]).exec();

    if(retrospective === null){
        return res.status(404).json({success: false, message: 'Not found'});
    }

    try {
        await retrospective.update(req.body);

        return res.json(retrospective);
    } catch (e) {
        res.json({success: false, message: e.message});
    }
});

export default router;