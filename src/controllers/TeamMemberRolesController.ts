import {Router} from "express";
import {Retrospective} from "../database/models/Retrospective";
import {IdentityMapper} from "../mappers/IdentityMapper";
import {IRetrospectiveReport} from "../models/IRetrospectiveReport";
import {CommentCategory} from "../database/models/CommentCategory";
import {Role} from "../database/models/Team";

const router = Router();

router.get('/', async (req, res, next) => {
    const roles = await Role.find();

    res.json(IdentityMapper.map(roles));
});



export default router;