import request from "supertest";
import {v4 as uuidv4} from 'uuid';
import {app} from '../../app'
import connection from "../../database/connection";
import {TimeUsageCategory} from "../../database/models/Evaluation";

describe("CommentCategoriesController endpoints", () => {
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
        const categories = [
            {
                name: 'Category 1',
                color: '#ffffff',
                initialPercentage: 50,
                increaseIsPositive: true,
            },
            {
                name: 'Category 2',
                color: '#coffee',
                initialPercentage: 50,
                increaseIsPositive: true,
            }
        ];

        await TimeUsageCategory.create(categories);

        return request(app)
            .get("/timeUsageCategories")
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then(response => {
                expect(response.body.length).toBe(categories.length);

                const categoryToCheck = categories[0];
                const persistedCategory = response.body.find((c: any) => c.color === categories[0].color);

                expect(categoryToCheck.name).toEqual(persistedCategory.name);
            })
    });
});