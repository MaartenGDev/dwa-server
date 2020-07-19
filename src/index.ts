import express from "express";
import cors from "cors";
import HomeController from './controllers/HomeController'
import RetrospectivesController from './controllers/RetrospectivesController'
import EvaluationsController from './controllers/EvaluationsController'
import CommentCategoriesController from './controllers/CommentCategoriesController'
import TimeUsageCategoriesController from './controllers/TimeUsageCategoriesController'
import TeamMemberRolesController from './controllers/TeamMemberRolesController'
import TeamsController from './controllers/TeamsController'
import AccountController from './controllers/AccountsController'
import {connection} from './database/connection';

const app = express()
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(express.json());
const port = 5001

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