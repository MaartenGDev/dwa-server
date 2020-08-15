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
import {IInsight} from "../models/IInsight";
import {ITeamMemberInsight} from "../models/ITeamMemberInsight";
import {ITeamMemberTimeUsage} from "../models/ITeamMemberTimeUsage";
import {IRatingInsight} from "../models/IRatingInsight";
import {IRetrospective} from "../models/IRetrospective";

const router = Router();

router.get('/teams/:id/me', async (req, res, next) => {
    const insight: IInsight = {
        metrics: [],
        evaluations: [],
        history: {
            datasets: [],
            labels: []
        }
    }

    res.json(insight);
});

router.get('/teams/:teamId/members/:userId', async (req, res, next) => {
    const insight: IInsight = {
        metrics: [],
        evaluations: [],
        history: {
            datasets: [],
            labels: []
        }
    }

    res.json(insight);
});

router.get('/teams/:id/overall', async (req, res, next) => {
    const insight: IInsight = {
        metrics: [],
        evaluations: [],
        history: {
            datasets: [],
            labels: []
        }
    }

    res.json(insight);
});

router.get('/teams/:id/members', async (req, res, next) => {
    const insights: ITeamMemberInsight[] = [
        {fullName: 'test', latestSprintRating: 1, latestSprintRatingChangePercentage: 10, timeUsage: [], userId: 'a'}
    ]

    res.json(insights);
});

router.get('/teams/:id/ratings', async (req, res, next) => {
    const insights: IRatingInsight[] = [
        {userId: 'a', fullName: 'test', sprintRating: 1, sprintRatingExplanation: 'Went ok', retrospective: {id: 'd', name: 'hello'} as IRetrospective}
    ]

    res.json(insights);
});

export default router;