import {Router} from "express";
import {Retrospective} from "../database/models/Retrospective";
import {IRetrospectiveReport} from "../models/IRetrospectiveReport";
import {IUserRetrospective} from "../models/IUserRetrospective";
import {Evaluation} from "../database/models/Evaluation";
import {IEvaluation} from "../models/IEvaluation";

const router = Router();

router.get('/', async (req, res, next) => {
    const evaluationsOfUser = (await Evaluation.find({user: req.auth.userId}))
        .reduce((acc: {[key: string]: IEvaluation}, cur) => {
            acc[(cur.retrospective as IUserRetrospective).id] = cur.toObject({virtuals: true});
            return acc;
        }, {});

    const retrospectives = await Retrospective.find();

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

    res.json(userRetrospectives);
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
        const retrospective = await Retrospective.create({...req.body, team: req.body.teamId});

        return res.json(retrospective);
    } catch (e) {
        res.json({success: false, message: e.message});
    }
});

router.patch('/:id', async (req, res, next) => {
    const retrospective = await Retrospective.findById(req.params.id);

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