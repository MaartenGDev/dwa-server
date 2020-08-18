import request from "supertest";
import {v4 as uuidv4} from 'uuid';
import {app} from '../../app'
import connection from "../../database/connection";
import {TimeUsageCategory} from "../../database/models/Evaluation";
import {TeamMemberRoleIdentifiers} from "../../database/TeamMemberRoleIdentifiers";
import {Role} from "../../database/models/Team";
import {IRole} from "../../models/IRole";

describe("TeamMemberRolesController endpoints", () => {
    const databaseName = 'retrospective' + uuidv4();

    let userId = '';
    let token = '';

    beforeAll(async () => {
        await connection.connect(databaseName);

        const response = await request(app)
            .post("/account/register")
            .send({
                fullName: 'test',
                email: 'example@example.com',
                password: 'hello'
            });

        userId = response.body.user.id;
        token = response.body.token;
    });

    afterAll(async (done) => {
        await connection.destroyDatabase(databaseName);
        await connection.disconnect(done);
    });

    test("It should return all teamMemberRoles", async () => {
        const roles = [
            {
                "_id": TeamMemberRoleIdentifiers.Member,
                "name": "Member",
                "canManageTeam": false,
                "canManageRetrospective": false,
                "canViewMemberInsights": false
            },
            {
                "_id": TeamMemberRoleIdentifiers.Manager,
                "name": "Manager",
                "canManageTeam": false,
                "canManageRetrospective": false,
                "canViewMemberInsights": true
            },
            {
                "_id": TeamMemberRoleIdentifiers.ScrumMaster,
                "name": "Scrum master",
                "canManageTeam": false,
                "canManageRetrospective": true,
                "canViewMemberInsights": true
            },
            {
                "_id": TeamMemberRoleIdentifiers.Admin,
                "name": "Admin",
                "canManageTeam": true,
                "canManageRetrospective": true,
                "canViewMemberInsights": true
            }
        ];

        await Role.create(roles);

        const rolesResponse = await request(app)
            .get("/teamMemberRoles")
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(rolesResponse.status).toBe(200);
        expect(rolesResponse.body.length).toBe(roles.length);

        const identifiersToCheck = [TeamMemberRoleIdentifiers.Member, TeamMemberRoleIdentifiers.Manager, TeamMemberRoleIdentifiers.ScrumMaster, TeamMemberRoleIdentifiers.Admin];

        identifiersToCheck.forEach(identifier => {
            const persistedRole = roles.find(role => role._id === identifier);
            const returnedRole = rolesResponse.body.find((role: IRole) => role._id === identifier);

            expect(persistedRole.name).toEqual(returnedRole.name);
            expect(persistedRole.canManageTeam).toEqual(returnedRole.canManageTeam);
        })
    });
});