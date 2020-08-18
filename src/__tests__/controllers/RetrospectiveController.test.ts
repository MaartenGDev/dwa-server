import request from "supertest";
import {v4 as uuidv4} from 'uuid';
import {app} from '../../app'
import connection from "../../database/connection";
import {Role, Team} from "../../database/models/Team";
import {data} from "../../database/seed";
import {TeamMemberRoleIdentifiers} from "../../database/TeamMemberRoleIdentifiers";
import {IUserRetrospective} from "../../models/IUserRetrospective";
import exp from "constants";

describe("RetrospectiveController endpoints", () => {
    const databaseName = 'retrospective' + uuidv4();

    let teamId = '';
    let userId = '';
    let token = '';

    beforeAll(async () => {
        await connection.connect(databaseName);
        await Role.insertMany(data.roles);

        const response = await request(app)
            .post("/account/register")
            .send({
                fullName: 'test',
                email: 'example2@example.com',
                password: 'hello'
            });

        const team = await Team.create({name: 'team 1', inviteCode: 'aa', members: []});
        teamId = team.id;

        userId = response.body.user.id;
        token = response.body.token;
    });

    afterAll(async (done) => {
        await connection.destroyDatabase(databaseName);
        await connection.disconnect(done);
    });

    test("should return 400 for incomplete post to /retrospectives", async () => {
        const retrospectiveToCreate = {
            name: 'Team1'
        };

        const response = await request(app)
            .post("/retrospectives")
            .set('Authorization', `Bearer ${token}`)
            .send(retrospectiveToCreate);

        expect(response.status).toBe(400);
    });

    test("It should return the created retrospective", async () => {
        const retrospectiveToCreate: IUserRetrospective = {
            actions: [],
            startDate: "2020-10-12",
            endDate: "2020-11-12",
            teamId: teamId,
            topics: [],
            name: 'Retro 1'
        };

        const response = await request(app)
            .post("/retrospectives")
            .set('Authorization', `Bearer ${token}`)
            .send(retrospectiveToCreate);

        expect(response.status).toBe(200);

        const createdRetrospective = response.body;

        expect(retrospectiveToCreate.name).toBe(createdRetrospective.name);
    });

    test("It should return the updated retrospective", async () => {
        const retrospectiveToCreate: IUserRetrospective = {
            actions: [],
            startDate: "2020-10-12",
            endDate: "2020-11-12",
            teamId: teamId,
            topics: [],
            name: 'Retro 1'
        };

        const updatedRetrospective: IUserRetrospective = {...retrospectiveToCreate, name: 'Updated'}

        const createResponse = await request(app)
            .post("/retrospectives")
            .set('Authorization', `Bearer ${token}`)
            .send(retrospectiveToCreate);

        const updateResponse = await request(app)
            .patch(`/retrospectives/${createResponse.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedRetrospective);

        expect(createResponse.status).toBe(200);
        expect(updateResponse.status).toBe(200);

        expect(createResponse.body.name).toBe(retrospectiveToCreate.name);
        expect(updateResponse.body.name).toBe(updatedRetrospective.name);
    });

    test("It should return not found with PATCH for unknown retrospective", async () => {
        const updateResponse = await request(app)
            .patch(`/retrospectives/5f17333922af6c15f283b4fc`)
            .set('Authorization', `Bearer ${token}`)
            .send({});

        expect(updateResponse.status).toBe(404);
    });


    test("It should return only the evaluation of the authenticated user", async () => {
        const retrospective: IUserRetrospective = {
            actions: [],
            startDate: "2020-10-12",
            endDate: "2020-11-12",
            teamId: teamId,
            topics: [],
            name: 'Retro 44'
        };

        const createResponse = await request(app)
            .post("/retrospectives")
            .set('Authorization', `Bearer ${token}`)
            .send(retrospective);

        const retrospectivesResponse = await request(app)
            .get("/retrospectives")
            .set('Authorization', `Bearer ${token}`)
            .send();

        const persistedRetrospective = retrospectivesResponse.body.find((r: IUserRetrospective) => r.id === createResponse.body.id);

        expect(createResponse.status).toBe(200);
        expect(retrospectivesResponse.status).toBe(200);

        expect(persistedRetrospective.name).toBe(retrospective.name);
        expect(persistedRetrospective.name).toBe(createResponse.body.name);
        expect(persistedRetrospective.evaluation).toBe(undefined);
    });
});