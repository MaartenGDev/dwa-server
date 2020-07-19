import {Router} from "express";
import {Retrospective} from "../database/models/Retrospective";
import {IdentityMapper} from "../mappers/IdentityMapper";
import {IRetrospectiveReport} from "../models/IRetrospectiveReport";
import {CommentCategory} from "../database/models/CommentCategory";
import {Role} from "../database/models/Team";
import {TimeUsageCategory} from "../database/models/Evaluation";

const router = Router();

router.get('/', async (req, res, next) => {
    const categories = await TimeUsageCategory.find();

    res.json(IdentityMapper.map(categories));
});



export default router;