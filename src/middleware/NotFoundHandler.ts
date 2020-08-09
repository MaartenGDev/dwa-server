import {IncomingMessage, NextFunction} from "connect";
import {Response} from "express";


export const NotFoundHandler = (req: IncomingMessage, res: Response, next: NextFunction) => {
    res.status(404).send({message: 'Endpoint not found!'});
    next();
}