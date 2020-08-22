# Retrospective server
Server for the retrospective [client](https://github.com/MaartenGDev/dwa-client).

## Setup
1. start a mongoDB instance(`docker run -v mongodbdata:/data/db -d -p 27017:27017 mongo`)
2. run `npm run seed`
3. create `.env` using: `cp .env.example .env`
4. configure `JWT_SECRET` variable in `.env` with a safe token. (open `node` shell and use the result of `require('crypto').randomBytes(64).toString('hex'))`.

## Stack
- NodeJS
- [Express](https://expressjs.com/)
- MongoDB + [Mongoose](https://mongoosejs.com/)
- [Jest](https://jestjs.io/) + [supertest](https://github.com/visionmedia/supertest)


## Database Structure
- Users
    - name
    - email
- Teams
    - Name
    - TeamMembers
        - userId
        - role
    - Retrospectives
        - name
        - startDate
        - endDate
        - Evaluations
            - timeUsage 
            - sprintRating
            - sprintRatingExplanation
            - comments 
- CommentCategories
    - name
    - color
- TimeUsageCategories
    - name
    - color