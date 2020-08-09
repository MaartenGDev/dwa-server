import {Router} from "express";
import {Retrospective} from "../database/models/Retrospective";
import {IRetrospectiveReport} from "../models/IRetrospectiveReport";
import {IUserRetrospective} from "../models/IUserRetrospective";
import {Evaluation} from "../database/models/Evaluation";
import {IEvaluation} from "../models/IEvaluation";

const router = Router();

router.get('/', async (req, res, next) => {
    const evaluationsOfUser = (await Evaluation.find({user: req.auth.userId})
        .populate([
            {path: 'comments', model: 'Comment'},
            {path: 'timeUsage', model: 'TimeUsage'},
        ])
        .exec())
        .reduce((acc: {[key: string]: IEvaluation}, cur) => {
            acc[cur.retrospective as any] = cur.toObject();
            return acc;
        }, {});

    const retrospectives = await Retrospective
        .find()
        .populate([
            {path: 'team', model: 'Team'},
        ])
        .exec();

    const userRetrospectives: IUserRetrospective[] = retrospectives.map(retro => {
        return {
            id: retro.id,
            name: retro.name,
            startDate: retro.startDate,
            endDate: retro.endDate,
            topics: retro.topics,
            actions: retro.actions,
            evaluation: evaluationsOfUser[retro.id],
            teamId: retro.team.id,
            team: retro.team,
        }
    })

    console.log(userRetrospectives)

    res.json(userRetrospectives);
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
        await retrospective.updateOne(req.body);

        return res.json(retrospective);
    } catch (e) {
        res.json({success: false, message: e.message});
    }
});


export default router;