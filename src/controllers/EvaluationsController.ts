import {Router} from "express";
import {Evaluation} from "../database/models/Evaluation";

const router = Router();

router.post('/', async (req, res, next) => {
    try{
        await Evaluation.create(req.body);

        return res.json({success: true});
    }catch (e) {
        res.json({success: true, message: e.message});
    }
});

export default router;