# CAST Radiation data storage

## Contributing

Please make sure ESLint extension is installed before commiting/opening a pull request.

## Dev requirements
### Required
- Node.js
- Git
### Optional
- Docker (no postgresql required)
- Postgresql

## Installation 
1. Clone repo

    `git clone https://github.com/RadiationChallengeProjectCAST/RadDataStorage.git`
2. Run `npm install`
3. Create `.env` with correct enviroment varibles set

    ```
    NODE_ENV = development
    POSTGRES_DB = radiationdb
    POSTGRES_USER = raddbaccess
    POSTGRES_PASSWORD = INSERT_POSTGRES_PASSWORD_HERE
    ```
4. Create `tokens.json` with format
    ```json
    {
    "teams": [
        {
        "teamId": 0,
        "teamName": "TEST_GROUP_IGNORE_RESULTS",
        "token": "TEST_TOKEN_FOR_TEST_TOKEN"
        },
        ...
        ]
    }
    ```
5. Create `replication.json` with format
    ```json
    [
        {
            "host": "HOST_IP"
        }
        ...
    ]
    ```

### Option 1: Docker (easier)
1. Run `docker-compose up` to start docker containers. 

    Allow through firewall. Should launch server with postgres on `localhost:3000`.

### Option 2: Manually setup postgresql on machine
1. Install postgresql.
2. Create role and database using commands in SQLSpecification.sql. Make sure to **change password**.
3. Launch application with `node index.js`