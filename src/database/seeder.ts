import {Role} from "./models/Team";
import {data} from './seed';
import connection from "./connection";


const run = async () => {
    await connection.connect();
    await Role.insertMany(data.roles);
    await connection.disconnect();
}

run()
    .then(() => console.log('Seeder finished!'))
    .catch(e => console.log('Seeder failed', e));