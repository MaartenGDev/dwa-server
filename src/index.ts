import express from "express";
import HomeController from './controllers/HomeController'
import ArticleController from './controllers/ArticleController'
const app = express()

const port = 3000

app.use('/', HomeController);
app.use('/articles', ArticleController);

app.listen(port, () => console.log(`Example environment listening at http://localhost:${port}`))