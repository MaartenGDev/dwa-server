import {Router} from "express";
import {CommentCategory} from "../database/models/CommentCategory";

const router = Router();

router.get('/', async (req, res, next) => {
    const commentCategories = await CommentCategory.find();

    res.json(commentCategories);
});



export default router;