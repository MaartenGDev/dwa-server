import {Router} from "express";
const router = Router();

router.get('/', (req, res, next) => {
    res.json({hello: 'world'});
});

export default router;
