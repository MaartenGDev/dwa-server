import {connection} from "./connection";
import {Role} from "./models/Team";
import {data} from './seed';

try{
    connection.then(async () => {
        await Role.insertMany(data.roles);
    }, err => console.log(err))
}catch (e) {
    console.warn('seeder failed', e);
}
