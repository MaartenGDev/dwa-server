import {Router} from "express";
import bcrypt from 'bcrypt';
import {User} from "../database/models/User";
const router = Router();

router.post('/login', async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});

    const hasCorrectPassword = await bcrypt.compare(req.body.password, user?.password);

    if(!hasCorrectPassword){
        return res.status(401).json({success: false, message: 'Unauthorized'});
    }

    res.json(user);
});

router.post('/register', async (req, res, next) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    try{
        await User.create({fullName: req.body.fullName, email: req.body.email, password: hashedPassword})

        res.json({success: true});
    }catch (e) {
        res.json({success: false, message: 'An user with that email already exists!'});
    }
});

export default router;
