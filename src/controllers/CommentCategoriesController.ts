import {Router} from "express";
import {Retrospective} from "../database/models/Retrospective";
import {IdentityMapper} from "../mappers/IdentityMapper";
import {IRetrospectiveReport} from "../models/IRetrospectiveReport";
import {CommentCategory} from "../database/models/CommentCategory";

const router = Router();

router.get('/', async (req, res, next) => {
    const commentCategories = await CommentCategory.find();

    res.json(IdentityMapper.map(commentCategories));
});



export default router;