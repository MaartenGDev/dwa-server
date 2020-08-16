import mongo from './database/connection'
import {app} from './app'

const port = 5001;

const configure = async () => {
    await mongo.connect();
}

configure().then(() => {
    app.listen(port, () => console.log(`Environment listening at http://localhost:${port}`))
})

