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

    const credentials = {email: 'test@example.com', password: 'test1'};

    test("It should reject register without required fields", () => {
        return request(app)
            .post("/account/register")
            .send(credentials)
            .expect(400);
    });

    test("It should register an account", () => {
        return request(app)
            .post("/account/register")
            .send({
                'fullName': 'Test',
                ...credentials
            })
            .expect(200)
            .then(response => {
                expect(response.body.success).toBe(true);
            });
    });

    test("It should be able to login with the created account", () => {
        return request(app)
            .post("/account/login")
            .send(credentials)
            .expect(200)
    });


    test("It should return the authenticated user for the me endpoint", async () => {
        const response = await request(app)
            .post("/account/login")
            .send(credentials);

        const {token} = response.body;

        return request(app)
            .get("/account/me")
            .set('Authorization', `Bearer ${token}`)
            .send(credentials)
            .expect(200)
    });

    test("It should return a authenticated token after registration", async () => {
        const account = {
            fullName: 'test',
            email: 'example2@example.com',
            password: 'hello'
        };

        const response = await request(app)
            .post("/account/register")
            .send(account);

        const {token} = response.body;

        return request(app)
            .get("/account/me")
            .set('Authorization', `Bearer ${token}`)
            .send(credentials)
            .expect(200)
            .then(response => {
                expect(response.body.fullName).toBe(account.fullName);
                expect(response.body.email).toBe(account.email);
            });
    });


    test("It should return bad request for invalid credentials", () => {
        return request(app)
            .post("/account/login")
            .send({
                email: 'test@example.com',
                password: 'test'
            })
            .expect(400)
    });

    test("Login should not invalidate credentials", async() => {
        const account = {
            fullName: 'test',
            email: 'example3@example.com',
            password: 'hello'
        };

        const registerResponse = await request(app)
            .post("/account/register")
            .send(account);

        const {token} = registerResponse.body;

        await request(app)
            .post("/account/logout")
            .set('Authorization', `Bearer ${token}`)
            .send(account)
            .expect(200);

        return request(app)
            .get("/account/me")
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
    });
});