import {Router} from "express";
import {Evaluation} from "../database/models/Evaluation";
import {IEvaluation} from "../models/IEvaluation";
import {IUserRetrospective} from "../models/IUserRetrospective";
import {IRetrospective} from "../models/IRetrospective";

const router = Router();

router.patch('/:id/evaluation', async (req, res, next) => {
    try{
        const evaluationFilter = {retrospective: req.params.id, user: req.auth.userId};
        const persistedEvaluation = await Evaluation.findOne(evaluationFilter);

        const timeUsage = req.body.timeUsage.map((t: any) => ({...t, category: t.categoryId}));
        const comments = req.body.comments.map((c: any) => ({...c, category: c.categoryId}));

        const updatedEvaluation = {...req.body, timeUsage, comments, retrospective: req.body.retrospectiveId, user: req.auth.userId};

        if(!isValidEvaluation(updatedEvaluation)){
            return res.status(400).json({success: false, message: 'Failed to save feedback, the provided feedback is invalid!'});
        }

        const feedbackPeriodEndDate = persistedEvaluation ? new Date((persistedEvaluation.retrospective as IRetrospective).endDate) : null;

        if (persistedEvaluation !== null && new Date() > feedbackPeriodEndDate)
        {
            return res.status(400).json({success: false, message: `The feedback period for this retrospective has already ended at ${feedbackPeriodEndDate}`});
        }

        const evaluation = persistedEvaluation === null
            ? await Evaluation.create(updatedEvaluation)
            : await Evaluation.findOneAndUpdate(evaluationFilter, updatedEvaluation, {new: true})

        return res.json(evaluation);
    }catch (e) {
        res.status(400).json({success: false, message: e.message});
    }
});

const isValidEvaluation = (evaluation: IEvaluation) => {
    const totalTimeUsagePercentage = evaluation.timeUsage.reduce((acc, cur) => acc + cur.percentage, 0);

    if (totalTimeUsagePercentage != 100)
    {
        return false;
    }

    return true;
}


export default router;