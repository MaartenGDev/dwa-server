import request from "supertest";
import {v4 as uuidv4} from 'uuid';
import {app} from '../../app'
import connection from "../../database/connection";
import {TimeUsageCategory} from "../../database/models/Evaluation";
import {TeamMemberRoleIdentifiers} from "../../database/TeamMemberRoleIdentifiers";
import {Role} from "../../database/models/Team";
import {IRole} from "../../models/IRole";
import {ITimeUsageCategory} from "../../models/ITimeUsageCategory";

describe("TimeUsageCategoriesController endpoints", () => {
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

    test("It should return all timeUsageCategories", async () => {
        const lastCategory = {
            name: 'category 3',
            color: '#fffffa',
            initialPercentage: 40,
            increaseIsPositive: true
        };

        const timeUsageCategories = await TimeUsageCategory.create([
            {
                name: 'category 1',
                color: '#fffffb',
                initialPercentage: 20,
                increaseIsPositive: true
            },
            {
                name: 'category 2',
                color: '#fffffc',
                initialPercentage: 30,
                increaseIsPositive: false
            },
            lastCategory
        ]);

        const timeUsageCategoriesResponse = await request(app)
            .get("/timeUsageCategories")
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(timeUsageCategoriesResponse.status).toBe(200);
        expect(timeUsageCategoriesResponse.body.length).toBe(timeUsageCategories.length);

        const persistedCategory = timeUsageCategories.find(c => c.name === lastCategory.name);
        const returnedCategory = timeUsageCategoriesResponse.body.find((c: ITimeUsageCategory) => c.name === lastCategory.name);

        expect(persistedCategory.initialPercentage).toBe(returnedCategory.initialPercentage);
        expect(persistedCategory.color).toBe(returnedCategory.color);
    });
});