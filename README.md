# Retrospective server
Server for the retrospective client.

## Setup
1. Start a mongoDB instance
2. run `npm run seed`
3. create `.env` using: `cp .env.example .env`
4. configure `JWT_SECRET` variable in `.env` with a safe token. (open `node` shell and use the result of `require('crypto').randomBytes(64).toString('hex'))`.

## Structure
- Groups
    - Name
    - Owner
        - id
        - name
    - Retrospectives
        - name
        - date
        - rating
            - category
            - score
        - note
            - category(good/room for improvement/on-my-mind)