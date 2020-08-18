import request from "supertest";
import {v4 as uuidv4} from 'uuid';
import {app} from '../../app'
import connection from "../../database/connection";
import {Role, Team} from "../../database/models/Team";
import {data} from "../../database/seed";
import {TeamMemberRoleIdentifiers} from "../../database/TeamMemberRoleIdentifiers";
import {IUserRetrospective} from "../../models/IUserRetrospective";
import exp from "constants";
import {IEvaluation} from "../../models/IEvaluation";
import {ITimeUsage} from "../../models/ITimeUsage";
import {TimeUsageCategory} from "../../database/models/Evaluation";

describe("RetrospectiveEvaluationController endpoints", () => {
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

        const team = await Team.create({name: 'team 2', inviteCode: 'aa', members: []});
        teamId = team.id;

        userId = response.body.user.id;
        token = response.body.token;
    });

    afterAll(async (done) => {
        await connection.destroyDatabase(databaseName);
        await connection.disconnect(done);
    });

    test("It stores the evaluation", async () => {
        const timeUsageCategories = await TimeUsageCategory.create([
            {
                name: 'category 1',
                color: '#ffffff',
                initialPercentage: 20,
                increaseIsPositive: true
            },
            {
                name: 'category 2',
                color: '#ffffff',
                initialPercentage: 40,
                increaseIsPositive: false
            },
            {
                name: 'category 3',
                color: '#ffffff',
                initialPercentage: 40,
                increaseIsPositive: true
            }
        ]);

        const retrospective: IUserRetrospective = {
            actions: [],
            startDate: "2020-10-12",
            endDate: "2020-11-12",
            teamId: teamId,
            topics: [],
            name: 'Retro 44'
        };

        const lastTimeUsage = {
            percentage: 20,
            categoryId: timeUsageCategories[2].id,
        };

        const evaluation: IEvaluation = {
            retrospectiveId: '',
            retrospective: '',
            timeUsage: [
                {
                    percentage: 40,
                    categoryId: timeUsageCategories[0].id,
                },
                {
                    percentage: 40,
                    categoryId: timeUsageCategories[1].id,
                },
                lastTimeUsage
            ],
            sprintRating: 60,
            sprintRatingExplanation: 'Went well',
            suggestedActions: 'Action 1',
            suggestedTopics: 'Topic 1',
            comments: [],
        }

        const createResponse = await request(app)
            .post("/retrospectives")
            .set('Authorization', `Bearer ${token}`)
            .send(retrospective);

        const retrospectiveId = createResponse.body.id;

        const evaluationResponse = await request(app)
            .patch(`/retrospectives/${retrospectiveId}/evaluation`)
            .set('Authorization', `Bearer ${token}`)
            .send({...evaluation, retrospectiveId});

        const retrospectivesResponse = await request(app)
            .get("/retrospectives")
            .set('Authorization', `Bearer ${token}`)
            .send();

        const persistedRetrospective = retrospectivesResponse.body.find((r: IUserRetrospective) => r.id === retrospectiveId);

        expect(evaluationResponse.status).toBe(200);
        expect(retrospectivesResponse.status).toBe(200);

        const persistedLastTimeUsage = persistedRetrospective.evaluation.timeUsage.find((tu: ITimeUsage) => tu.category.id === lastTimeUsage.categoryId);

        expect(persistedRetrospective.evaluation.timeUsage.length).toBe(evaluation.timeUsage.length);
        expect(persistedLastTimeUsage.percentage).toBe(lastTimeUsage.percentage);
    });

    test("It returns bad request when the timeUsage doesn't add up to 100%", async () => {
        const retrospective: IUserRetrospective = {
            actions: [],
            startDate: "2020-10-12",
            endDate: "2020-11-12",
            teamId: teamId,
            topics: [],
            name: 'Retro 45'
        };

        const evaluation: IEvaluation = {
            retrospectiveId: '',
            retrospective: '',
            timeUsage: [
                {
                    percentage: 40,
                    categoryId: '5f17333922af6c15f283b4fc',
                },
                {
                    percentage: 40,
                    categoryId: '5f17333922af6c15f283b4fd',
                },
            ],
            sprintRating: 60,
            sprintRatingExplanation: 'Went well',
            suggestedActions: 'Action 1',
            suggestedTopics: 'Topic 1',
            comments: [],
        }

        const createResponse = await request(app)
            .post("/retrospectives")
            .set('Authorization', `Bearer ${token}`)
            .send(retrospective);

        const retrospectiveId = createResponse.body.id;

        const evaluationResponse = await request(app)
            .patch(`/retrospectives/${retrospectiveId}/evaluation`)
            .set('Authorization', `Bearer ${token}`)
            .send({...evaluation, retrospectiveId});

        expect(evaluationResponse.status).toBe(400);
        expect(evaluationResponse.body.success).toBe(false);
        expect(evaluationResponse.body.message).toBe('Failed to save feedback, the provided feedback is invalid!');
    });
});