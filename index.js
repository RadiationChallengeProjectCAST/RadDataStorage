const dotenv = require('dotenv');

dotenv.config();

const fs = require('fs');

const replicationRemotes = JSON.parse(fs.readFileSync('replication.json', 'utf8'));

const express = require('express');

const app = express();
const port = process.env.port || 3000;

const bodyParser = require('body-parser');
const { body, query } = require('express-validator');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

console.log(process.env.NODE_ENV);
const axios = require('axios');

const { CreatePool } = require('./utils/db_utils.js');
const { CheckValidation } = require('./utils/general_utils');

const client = CreatePool();
client.connect();

const { setupTeamsTokens } = require('./utils/setupDB.js');

setupTeamsTokens(client);

app.use(express.static('pages', { extensions: ['html'] }));

app.post('/api/upload_data', [
    body('token').notEmpty(),
    body('floor').isInt({ min: 1, max: 4 }),
    body('cpm').isFloat(),
    body('x').isFloat(),
    body('y').isFloat(),
], CheckValidation, async (req, res) => {
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

    // res.send (token + " | " + cpm + " | " + floor + " | " + locX + " | " + locY); //---DEBUG---
    // res.send (req.body); //---DEBUG---

    const result = await client.query({
        text: 'SELECT teamid FROM team WHERE teamtoken = $1',
        values: [req.body.token],
    });

    // Do NOT use .rowCount as that does not return number of rows in query.
    if (result.rows.length === 0) {
        res.status(422);
        res.json({
            success: false,
            errors: [{
                code: 102,
                message: 'Invalid token.',
            }],
        });
        return;
    }
    const teamID = result.rows[0].teamid;

    const insertQuery = 'INSERT INTO reading (teamid, posfloor, posx, posy, cpm) VALUES ($1, $2, $3, $4, $5);';
    const values = [teamID, req.body.floor, req.body.x, req.body.y, req.body.cpm];

    try {
        await client.query('BEGIN');
        await client.query(insertQuery, values);
        await client.query('COMMIT');
        res.status(201);
        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);

        await client.query('ROLLBACK');
        res.status(500);
        res.json({
            success: false,
            errors: [{
                code: 201,
                message: 'Error commiting to db.',
            }],
        });
    }
});

app.get('/api/validateToken',
    query('token').notEmpty(),
    CheckValidation,
    async (req, res) => {
        const result = await client.query({
            text: 'SELECT teamid, teamname FROM team WHERE teamtoken = $1',
            values: [req.query.token],
        }).catch((e) => {
            console.log(e);
            res.status(500);
            res.json({
                success: false,
                errors: [{
                    code: 202,
                    message: 'Error selecting from db.',
                }],
            });
        });

        if (result.rows.length === 0) {
            res.status(422);
            res.json({
                success: false,
                errors: [{
                    code: 102,
                    message: 'Invalid token.',
                }],
            });
            return;
        }

        res.status(200);
        res.json({
            success: true,
            teamid: result.rows[0].teamid,
            teamName: result.rows[0].teamname,
        });
    });

app.get('/api/readings',
    [body('teamid').optional().isInt()],
    CheckValidation,
    async (req, res) => {
        let queryText = 'SELECT * FROM reading JOIN team ON reading.teamid = team.teamid';

        if (req.query.teamid) {
            const TeamID = req.query.teamid;
            queryText = `SELECT * FROM reading JOIN team on reading.teamid = team.teamid WHERE reading.teamid = ${TeamID}`;
        }

        const result = await client.query({
            text: queryText,
        }).catch((e) => {
            console.log(e);
            res.status(500);
            res.json({
                success: false,
                errors: [{
                    code: 202,
                    message: 'Error selecting from db.',
                }],
            });
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

        res.json({
            success: true,
            readings: response,
        });
    });

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

exports.app = app;
