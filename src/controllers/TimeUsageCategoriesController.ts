import {Router} from "express";
import {TimeUsageCategory} from "../database/models/Evaluation";

const router = Router();

router.get('/', async (req, res, next) => {
    const categories = await TimeUsageCategory.find();

    res.json(categories);
});



export default router;