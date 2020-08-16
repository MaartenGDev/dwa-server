import request from "supertest";
import { v4 as uuidv4 } from 'uuid';
import {app} from '../../app'
import connection from "../../database/connection";

describe("AccountController endpoints", () => {
    const databaseName = 'retrospective' + uuidv4();
    beforeAll(async () => {
        await connection.connect(databaseName);
    });

    afterAll(async (done) => {
        await connection.destroyDatabase(databaseName);
        await connection.disconnect(done);
    });

    const credentials = {email: 'test@example.com', password: 'test'};

    test("It should register an account", () => {
        return request(app)
            .post("/account/register")
            .send({
                'fullName': 'Test',
                ...credentials
            })
            .expect(200)
    });

    test("It should be able to login with the created account", () => {
        return request(app)
            .post("/account/login")
            .send(credentials)
            .expect(200)
    });
});