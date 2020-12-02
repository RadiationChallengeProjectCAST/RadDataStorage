# CAST Radiation data storage

## Contributing

Please make sure ESLint extension is installed before commiting/opening a pull request.

## Installation

1. Clone this repo

    Run in terminal: `git clone https://github.com/RadiationChallengeProjectCAST/RadDataStorage.git`
2. Run in terminal: `npm install`
3. Create `.env` file with correct enviroment varibles set

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
        "token": "TEST_TOKEN_FOR_TEST_TOKEN",
        "test": true
        },
        {
        "teamId": 1,
        "teamName": "TEST_GROUP_IGNORE_RESULTS_2",
        "token": "TEST_TOKEN_FOR_TEST_TOKEN_2",
        "test": true
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

## Running the code

### Option 1: Set up the environment

1. Install the following software

    - Node.js
    - Postgresql

2. Create a role and database using commands in SQLSpecification.sql. Make sure to **change the password**.
3. Launch application with `node index.js`

### Option 2: Running inside a container

1. Install [Docker](https://www.docker.com/get-started)

2. Run in terminal `docker-compose up` to start docker containers.

    Make sure to allow through firewall.
