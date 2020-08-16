import request from "supertest";
import { v4 as uuidv4 } from 'uuid';
import {app} from '../../app'
import connection from "../../database/connection";
import {Role} from "../../database/models/Team";
import {data} from "../../database/seed";
import {TeamMemberRoleIdentifiers} from "../../database/TeamMemberRoleIdentifiers";

describe("TeamController endpoints", () => {
    const databaseName = 'retrospective' + uuidv4();

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

        userId = response.body.user.id;
        token = response.body.token;
    });

    afterAll(async (done) => {
        await connection.destroyDatabase(databaseName);
        await connection.disconnect(done);
    });

    test("It should add the authenticated user as admin of the team", () => {
        const team = {
            name: 'Hello world'
        };

        return request(app)
            .post("/teams")
            .set('Authorization', `Bearer ${token}`)
            .send(team)
            .expect(200)
            .then(response => {
                const member = response.body.members.find((member: any) => member.user.id === userId);

                expect(response.body.name).toBe(team.name);
                expect(member.role.id).toBe(TeamMemberRoleIdentifiers.Admin);
                expect(member.role.canManageTeam).toBe(true);
            });
    });

    test("It return the created team in /teams", async () => {
        const team = {
            name: 'Team1'
        };

        const response = await request(app)
            .post("/teams")
            .set('Authorization', `Bearer ${token}`)
            .send(team);

        const createdTeamId = response.body.id;

        return request(app)
            .get("/teams")
            .set('Authorization', `Bearer ${token}`)
            .send()
            .then(response => {
                const createdTeam = response.body.find((team: any) => team.id === createdTeamId);
                expect(createdTeam.name).toBe(team.name);
            });
    });
});