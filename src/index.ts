import express from "express";
import cors from "cors";
import {config} from 'dotenv'
import jwt from 'express-jwt';
import HomeController from './controllers/HomeController'
import RetrospectivesController from './controllers/RetrospectivesController'
import EvaluationsController from './controllers/EvaluationsController'
import CommentCategoriesController from './controllers/CommentCategoriesController'
import TimeUsageCategoriesController from './controllers/TimeUsageCategoriesController'
import TeamMemberRolesController from './controllers/TeamMemberRolesController'
import TeamsController from './controllers/TeamsController'
import AccountController from './controllers/AccountsController'
import {connection} from './database/connection';

declare global {
    namespace Express {
        interface Request {
            auth: {userId: string}
        }
    }
}

config();
const port = 5001

const app = express()
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(express.json());
app.use(jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'], requestProperty: 'auth'})
    .unless({path: ['/account/login', '/account/register']}));

connection.then(() => {}, err => console.log(err))

app.use('/', HomeController);
app.use('/retrospectives', RetrospectivesController);
app.use('/evaluations', EvaluationsController);
app.use('/commentCategories', CommentCategoriesController);
app.use('/timeUsageCategories', TimeUsageCategoriesController);
app.use('/teamMemberRoles', TeamMemberRolesController);
app.use('/teams', TeamsController);
app.use('/account', AccountController);

app.listen(port, () => console.log(`Environment listening at http://localhost:${port}`))