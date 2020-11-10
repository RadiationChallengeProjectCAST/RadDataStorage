const dotenv = require('dotenv');

dotenv.config();

const fs = require('fs');

const replicationRemotes = JSON.parse(fs.readFileSync('replication.json', 'utf8'));

const express = require('express');

const app = express();
const port = process.env.port || 3000;
const HTMLDir = 'pages/';

const bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

console.log(process.env.NODE_ENV);
const axios = require('axios');

const { CreatePool } = require('./utils/db_utils.js');

const client = CreatePool();
client.connect();

const { setupTeamsTokens } = require('./utils/setupDB.js');

setupTeamsTokens(client);

function servePage(path, res) {
    fs.readFile(path, (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
    });
}

app.post('/api/upload_data', async (req, res) => {
    console.log('Received Reading POST');

    // Replicates request to other servers specifed in replication.json
    if (req.body.replicated !== true) {
        const replicationReq = req.body;
        replicationReq.replicated = true;

        replicationRemotes.forEach((x) => {
            axios.post(`${x.host}/api/upload_data`,
                req.body).catch((error) => {
                console.log(error);
            });
        });
    }

    let token;
    let cpm;
    let floor;
    let locX;
    let locY;

    // Token verification
    if (req.is('json')) {
        token = req.body.token;
        cpm = req.body.reading.cpm;
        floor = req.body.reading.location.floor;
        locX = req.body.reading.location.x;
        locY = req.body.reading.location.y;
    } else {
        ({
            token,
            cpm,
            floor,
            locX,
            locY,
        } = req.body);
    }

    // res.send (token + " | " + cpm + " | " + floor + " | " + locX + " | " + locY); //---DEBUG---
    // res.send (req.body); //---DEBUG---

    const result = await client.query({
        text: 'SELECT teamid FROM team WHERE teamtoken = $1',
        values: [token],
    });

    if (result.rowCount === 0) {
        res.status(422);
        res.send('Invalid token.');
        return;
    }

    const teamID = result.rows[0].teamid;

    const insertQuery = 'INSERT INTO reading (teamid, posfloor, posx, posy, cpm) VALUES ($1, $2, $3, $4, $5);';
    const values = [teamID, floor, locX, locY, cpm];

    try {
        await client.query('BEGIN');
        await client.query(insertQuery, values);

        res.status(201);

        res.send(`Data submitted sucessfully. cpm: ${cpm} floor: ${floor} locX: ${locX} locY: ${locY}teamID: ${teamID}`);
        await client.query('COMMIT');
    } catch (err) {
        console.log(err);

        res.status(500);
        res.send('Error commiting to db.');
        await client.query('ROLLBACK');
    }
});

app.get('/api/validateToken', async (req, res) => {
    if (!req.query.token) {
        res.status(422);
        res.send('Token parameter must be specifed.');
        return;
    }

    const result = await client.query({
        text: 'SELECT teamid, teamname FROM team WHERE teamtoken = $1',
        values: [req.query.token],
    });

    if (result.rowCount === 0) {
        res.status(422);
        res.send('Invalid token.');
        return;
    }

    res.send({
        teamid: result.rows[0].teamid,
        teamName: result.rows[0].teamname,
    });
});

app.get('/api/readings', async (req, res) => {
    let queryText = 'SELECT * FROM reading JOIN team ON reading.teamid = team.teamid';

    if (req.query.teamid) {
        const TeamID = req.query.teamid;
        queryText = `SELECT * FROM reading JOIN team on reading.teamid = team.teamid WHERE reading.teamid = ${TeamID}`;
    }

    const result = await client.query({
        text: queryText,
    });

    const response = [];
    result.rows.forEach((reading) => {
        if (process.env.NODE_ENV === 'production' && reading.teamtoken === 'TEST_TOKEN_FOR_TEST_TOKEN') {
            return;
        }
        response.push({
            teamid: reading.teamid,
            teamname: reading.teamname,
            reading: {
                cpm: reading.cpm,
                location: {
                    floor: reading.posfloor,
                    x: reading.posx,
                    y: reading.posy,
                },
            },
        });
    });

    res.send(response);
});

app.get('/record', (req, res) => {
    // Serve record.html
    servePage(`${HTMLDir}record.html`, res);
});

app.get('/validatetoken', (req, res) => {
    servePage(`${HTMLDir}validatetoken.html`, res);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

exports.app = app;
