import {Router} from "express";
import {Role} from "../database/models/Team";

const router = Router();

router.get('/', async (req, res, next) => {
    const roles = await Role.find();

    res.json(roles);
});



export default router;