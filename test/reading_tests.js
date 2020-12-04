const request = require('supertest');
const { expect } = require('chai');
const async = require('async');
const { app } = require('../index.js');
const { UploadReading, DeleteAllTestReading } = require('./test_util');

describe('GET api/readings', () => {
    before((done) => {
        DeleteAllTestReading(done);
    });
    afterEach((done) => {
        DeleteAllTestReading(done);
    });
    describe('GET valid json', () => {
        it('should return 200 and type json', (done) => {
            // Async test series https://stackoverflow.com/a/25945659
            async.series([
                (cb) => UploadReading(cb, app, 'TEST_TOKEN_FOR_TEST_TOKEN', true),
                (cb) => UploadReading(cb, app, 'TEST_TOKEN_FOR_TEST_TOKEN', true),
                (cb) => UploadReading(cb, app, 'TEST_TOKEN_FOR_TEST_TOKEN', true),
                (cb) => {
                    request(app)
                        .get('/api/readings')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end((err, res) => {
                            if (err) {
                                console.log(err);
                                cb(err);
                            }
                            expect(res.body.success);
                            expect(res.body.readings).to.be.length(3);
                            cb();
                        });
                },
            ], done);
        }).timeout(10000);
        it('should return filtered json with 3 results', (done) => {
            // Async test series https://stackoverflow.com/a/25945659
            let teamid1;
            let teamid2;
            async.series([
                (cb) => UploadReading(cb, app, 'TEST_TOKEN_FOR_TEST_TOKEN', true),
                (cb) => UploadReading(cb, app, 'TEST_TOKEN_FOR_TEST_TOKEN', true),
                (cb) => UploadReading(cb, app, 'TEST_TOKEN_FOR_TEST_TOKEN', true),
                (cb) => UploadReading(cb, app, 'TEST_TOKEN_FOR_TEST_TOKEN_2', true),
                (cb) => {
                    request(app)
                        .get('/api/validateToken')
                        .query({
                            'token': 'TEST_TOKEN_FOR_TEST_TOKEN',
                        })
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end((err, res) => { teamid1 = res.body.teamid; cb(); });
                },
                (cb) => {
                    request(app)
                        .get('/api/validateToken')
                        .query({
                            'token': 'TEST_TOKEN_FOR_TEST_TOKEN_2',
                        })
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end((err, res) => { teamid2 = res.body.teamid; cb(); });
                },
                (cb) => {
                    request(app)
                        .get('/api/readings')
                        .query({ teamid: teamid1 })
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end((err, res) => {
                            if (err) {
                                cb(err);
                            }
                            expect(res.body.success);
                            expect(res.body.readings).to.be.length(3);
                            cb();
                        });
                },
                (cb) => {
                    request(app)
                        .get('/api/readings')
                        .query({ teamid: teamid2 })
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end((err, res) => {
                            if (err) {
                                cb(err);
                            }
                            expect(res.body.success);
                            expect(res.body.readings).to.be.length(1);
                            cb();
                        });
                },
            ], done);
        });
    });
});
