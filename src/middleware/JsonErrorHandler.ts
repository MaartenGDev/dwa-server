import {IncomingMessage, NextFunction} from "connect";
import {Response} from "express";


export const jsonErrorHandler = (err: any, req: IncomingMessage, res: Response, next: NextFunction) => {
    if (err) {
        res.status(err.status).send({message: err.message});

        return;
    }
    next();
}