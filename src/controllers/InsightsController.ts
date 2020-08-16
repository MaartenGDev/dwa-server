import {Router} from "express";
import {Retrospective} from "../database/models/Retrospective";
import {Evaluation} from "../database/models/Evaluation";
import {IUser} from "../models/IUser";
import {IRatingInsight} from "../models/IRatingInsight";
import {IRetrospective} from "../models/IRetrospective";
import {InsightService} from "../services/InsightService";
import {Team} from "../database/models/Team";

const insightService = new InsightService();
const router = Router();

const isMemberOfTeam = async (teamId: string, userId: string) => {
    const requestedTeam = await Team.findOne({_id: teamId});

    return requestedTeam.members.some(m => m.user.id.toString() === userId);
}

router.get('/teams/:id/me', async (req, res, next) => {
    if(!(await isMemberOfTeam(req.params.id, req.auth.userId))){
        return res.status(403).json({success: false, message: 'This team does not exist or you don\'t have access.'});
    }

    const insight = await insightService.getInsightForTeam(req.params.id, req.auth.userId);

    res.json(insight);
});

router.get('/teams/:teamId/members/:userId', async (req, res, next) => {
    const requestedTeam = await Team.findOne({_id: req.params.teamId});
    const isViewingOwnInsights = req.auth.userId === req.params.userId;
    const canViewMemberInsights = isViewingOwnInsights || requestedTeam.members.some(m => m.user.id.toString() === req.auth.userId && m.role.canViewMemberInsights);

    if(!canViewMemberInsights){
        return res.status(403).json({success: false, message: 'This team does not exist or you don\'t have access.'});
    }

    const insight = await insightService.getInsightForTeam(req.params.teamId, req.params.userId);

    res.json(insight);
});

router.get('/teams/:id/overall', async (req, res, next) => {
    if(!(await isMemberOfTeam(req.params.id, req.auth.userId))){
        return res.status(403).json({success: false, message: 'This team does not exist or you don\'t have access.'});
    }

    const insight = await insightService.getInsightForTeam(req.params.id);

    res.json(insight);
});

router.get('/teams/:id/members', async (req, res, next) => {
    if(!(await isMemberOfTeam(req.params.id, req.auth.userId))){
        return res.status(403).json({success: false, message: 'This team does not exist or you don\'t have access.'});
    }

    const insights = await insightService.getTeamMemberInsights(req.params.id);

    res.json(insights);
});

router.get('/teams/:id/ratings', async (req, res, next) => {
    const requestedTeam = await Team.findOne({_id: req.params.id});
    const canViewMemberInsights = requestedTeam.members.some(m => m.user.id.toString() === req.auth.userId && m.role.canViewMemberInsights);

    if(!canViewMemberInsights){
        return res.status(403).json({success: false, message: 'This team does not exist or you don\'t have access.'});
    }

    const retrospectives = await Retrospective.find({team: req.params.id}).select('id');
    const evaluations = await Evaluation.find({retrospective: {$in: retrospectives.map(r => r._id)}});

    const insights: IRatingInsight[] = evaluations.map(e => {
        const user = e.user as IUser;

        return {
            userId: user.id,
            fullName: user.fullName,
            sprintRating: e.sprintRating,
            sprintRatingExplanation: e.sprintRatingExplanation,
            retrospective: e.retrospective as IRetrospective
        }
    });

    res.json(insights);
});

export default router;