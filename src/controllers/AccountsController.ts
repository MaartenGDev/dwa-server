import {Router} from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {User} from "../database/models/User";
const router = Router();

router.post('/login', async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});

    const hasCorrectPassword = !!user && await bcrypt.compare(req.body.password, user?.password);

    if(!hasCorrectPassword){
        return res.status(400).json({success: false, message: 'Incorrect username/password'});
    }

    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, { expiresIn: '1800s' });

    res.json({
        success: true,
        token,
        user
    });
});

router.post('/register', async (req, res, next) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    try{
        const user = await User.create({fullName: req.body.fullName, email: req.body.email, password: hashedPassword})
        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, { expiresIn: '1800s' });

        res.json({
            success: true,
            token,
            user
        });
    }catch (e) {
        res.status(400).json({success: false, message: 'An user with that email already exists!'});
    }
});

router.get('/me', async (req, res, next) => {
    const user = await User.findById(req.auth.userId);

    res.json(user);
});

router.post('/logout', async (req, res, next) => {
    res.json({
        success: true
    });
});

export default router;
