const fs = require('fs');

const tokens = JSON.parse(fs.readFileSync('tokens.json', 'utf8'));

const dotenv = require('dotenv');

dotenv.config();

const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.HOST_POSTGRES || 'localhost',
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.PORT_POSTGRES || '5432',
});

pool.connect();

pool.query({ text: 'CREATE TABLE IF NOT EXISTS reading ( readingid SERIAL PRIMARY KEY, teamid INT, posfloor INT, posx DECIMAL, posy DECIMAL, cpm DECIMAL, datetimerecorded TIMESTAMP DEFAULT CURRENT_TIMESTAMP);' })
    .then(pool.query({ text: 'CREATE TABLE IF NOT EXISTS team (teamid SERIAL PRIMARY KEY, teamtoken VARCHAR(32), teamname VARCHAR(32));' }).catch((e) => console.error(e.stack).then(

    )))
    .catch((e) => console.error(e.stack));

function setupTeamsTokens(client) {
    client.query({
        text: 'SELECT count(teamid) FROM team',
    }).then((res) => {
        if (parseInt(res.rows[0].count, 10) === 0) {
            tokens.teams.forEach(
                (element) => {
                    client.query({
                        text: 'INSERT INTO team(teamtoken, teamname) VALUES($1, $2)',
                        values: [element.token, element.teamName],
                    })
                        .catch((e) => console.error(e.stack));
                },
            );
        }
    });
}

setTimeout(() => {
    setupTeamsTokens(pool);
}, 3000);

module.exports.setupTeamsTokens = setupTeamsTokens;
