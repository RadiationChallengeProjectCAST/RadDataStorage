const request = require('supertest');
const async = require('async');
const { expect } = require('chai');
const { app } = require('../index.js');

describe('GET /api/validateToken', () => {
    describe('GET valid test tokens 1 and 2', () => {
        it('should return 200 and team ids', (done) => {
            async.series([
                (cb) => {
                    request(app)
                        .get('/api/validateToken')
                        .query({
                            'token': 'TEST_TOKEN_FOR_TEST_TOKEN',
                        })
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end((err, res) => {
                            if (err) return done(err);
                            expect(res.body.success);
                            return cb();
                        });
                },
                (cb) => {
                    request(app)
                        .get('/api/validateToken')
                        .query({
                            'token': 'TEST_TOKEN_FOR_TEST_TOKEN_2',
                        })
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end((err, res) => {
                            if (err) return done(err);
                            expect(res.body.success);
                            return cb();
                        });
                }],
            done);
        });
        it('should return 422 on invalid token', (done) => {
            request(app)
                .get('/api/validateToken')
                .query({
                    'token': 'INVALID_TOKEN_STRING',
                })
                .expect('Content-Type', /json/)
                .expect(422, {
                    success: false,
                    errors: [{
                        code: 102,
                        message: 'Invalid token.',
                    }],
                }, done);
        });
        it('should return 422 on no token specified', (done) => {
            request(app)
                .get('/api/validateToken')
                .expect('Content-Type', /json/)
                .expect(422, {
                    success: false,
                    errors: [
                        {
                            code: 101,
                            message: 'token parameter is missing or is invalid.',
                        },
                    ],
                }, done);
        });
    });
});
