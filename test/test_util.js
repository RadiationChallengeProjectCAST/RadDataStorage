const dotenv = require('dotenv');

dotenv.config('..');

const request = require('supertest');

const fs = require('fs');

const testTokens = JSON.parse(fs.readFileSync('./tokens.json', 'utf8')).teams.filter((el) => el.test);

const { getRandomInt } = require('../utils/general_utils');

const { CreatePool } = require('../utils/db_utils.js');

const client = CreatePool();
client.connect();

if (process.env.NODE_ENV === 'production') {
    throw new Error('Do not run in production');
}

function UploadReading(cb, app, token, random) {
    if (testTokens.some((e) => e.token === token)) {
        request(app)
            .post('/api/upload_data')
            .send({
                'token': token,
                'reading': {
                    'cpm': random ? getRandomInt(0, 1000) : 10000,
                    'location': {
                        'floor': random ? getRandomInt(0, 4) : 1,
                        'x': random ? getRandomInt(0, 100) : 34,
                        'y': random ? getRandomInt(0, 100) : 1,
                    },
                },
            }).end((err) => {
                if (err) {
                    console.log(err);
                    cb(err);
                }
                cb();
            });
    } else {
        cb('Bad token. Check if running in production');
    }
}

function DeleteAllTestReading(done) {
    client.query({ text: 'BEGIN;' }).then(() => {
        const tokens = testTokens.map((e) => e.token);
        client.query({
            text: 'DELETE FROM reading USING team WHERE reading.teamid = team.teamid AND team.teamtoken = ANY($1)',
            values: [tokens],
        })
            .then(() => client.query({ text: 'COMMIT;' })
                .then(() => done())
                .catch((e) => {
                    console.log(e);
                    throw e;
                }))
            .catch((e) => {
                console.log(e);
                throw e;
            });
    }).catch((e) => {
        console.error(e);
        client.query({ text: 'ROLLBACK;' });
    });
}

exports.UploadReading = UploadReading;
exports.DeleteAllTestReading = DeleteAllTestReading;
