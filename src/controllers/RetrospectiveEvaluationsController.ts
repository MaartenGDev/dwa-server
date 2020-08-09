import {Router} from "express";
import {Evaluation} from "../database/models/Evaluation";

const router = Router();

router.patch('/:id/evaluation', async (req, res, next) => {
    try{
        const evaluationFilter = {retrospective: req.params.id, user: req.auth.userId};
        const persistedEvaluation = await Evaluation.findOne(evaluationFilter);

        const timeUsage = req.body.timeUsage.map((t: any) => ({...t, category: t.categoryId}));
        const comments = req.body.comments.map((c: any) => ({...c, category: c.categoryId}));

        const updatedEvaluation = {...req.body, timeUsage, comments, retrospective: req.body.retrospectiveId, user: req.auth.userId};

        const evaluation = persistedEvaluation === null
            ? await Evaluation.create(updatedEvaluation)
            : await Evaluation.findOneAndUpdate(evaluationFilter, updatedEvaluation, {new: true})

        return res.json(evaluation);
    }catch (e) {
        res.status(400).json({success: false, message: e.message});
    }
});

export default router;