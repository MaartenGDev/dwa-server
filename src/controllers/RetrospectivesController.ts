import {Router} from "express";
import {Retrospective} from "../database/models/Retrospective";
import {IRetrospectiveReport} from "../models/IRetrospectiveReport";
import {IUserRetrospective} from "../models/IUserRetrospective";
import {Evaluation} from "../database/models/Evaluation";
import {IEvaluation} from "../models/IEvaluation";
import {ISuggestedTopic} from "../models/ISuggestedTopic";
import {IUser} from "../models/IUser";
import {ISuggestedAction} from "../models/ISuggestedAction";
import {IComment} from "../models/IComment";
import {DateHelper} from "../helpers/DateHelper";
import {ITeam} from "../models/ITeam";
import {IRetrospective} from "../models/IRetrospective";

const router = Router();

router.get('/', async (req, res, next) => {
    const evaluationsOfUser = (await Evaluation.find({user: req.auth.userId}))
        .reduce((acc: {[key: string]: IEvaluation}, cur) => {
            acc[(cur.retrospective as IRetrospective).id] = cur.toObject({virtuals: true});
            return acc;
        }, {});

    const retrospectives = await Retrospective.find();

    const userRetrospectives: IUserRetrospective[] = retrospectives.map(retro => {
        return {
            id: retro.id,
            name: retro.name,
            startDate: DateHelper.format(retro.startDate),
            endDate: DateHelper.format(retro.endDate),
            topics: retro.topics,
            actions: retro.actions,
            evaluation: evaluationsOfUser[retro.id],
            teamId: (retro.team as ITeam).id,
            team: retro.team as ITeam,
        }
    })

    res.json(userRetrospectives);
});

router.get('/:id/report', async (req, res, next) => {
    const retrospectiveId = req.params.id;
    const retrospective = await Retrospective.findOne({_id: retrospectiveId});

    const evaluations = await Evaluation.find({retrospective: retrospectiveId});

    const suggestedActions: ISuggestedAction[] = evaluations
        .filter(e => e.suggestedActions.length > 0)
        .map(e => ({description: e.suggestedActions, suggestedBy: e.user as IUser}));

    const suggestedTopics: ISuggestedTopic[] = evaluations
        .filter(e => e.suggestedTopics.length > 0)
        .map(e => ({description: e.suggestedTopics, suggestedBy: e.user as IUser}));

    const comments = evaluations.reduce((acc: IComment[], cur: IEvaluation) => [...acc, ...cur.comments.map(c => {
        const rawObject = (c as any).toObject({virtuals: true});
        rawObject.evaluation = cur;
        return rawObject;
    })], []);

    const report: IRetrospectiveReport = {
      retrospective,
      comments,
      suggestedActions,
      suggestedTopics
    };

    res.json(report);
});

router.post('/', async (req, res, next) => {
    try {
        const retrospective = await Retrospective.create({...req.body, team: req.body.teamId});

        return res.json(retrospective);
    } catch (e) {
        res.status(400).json({success: false, message: e.message});
    }
});

router.patch('/:id', async (req, res, next) => {
    const retrospective = await Retrospective.findById(req.params.id);

    if(retrospective === null){
        return res.status(404).json({success: false, message: 'Not found'});
    }

    try {
        const persistedRetrospective = await Retrospective.findByIdAndUpdate(req.params.id, req.body, {new: true});

        return res.json(persistedRetrospective);
    } catch (e) {
        res.json({success: false, message: e.message});
    }
});


export default router;