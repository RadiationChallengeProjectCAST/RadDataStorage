const request = require('supertest');
const async = require('async');
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
                        .expect(200, cb);
                },
                (cb) => {
                    request(app)
                        .get('/api/validateToken')
                        .query({
                            'token': 'TEST_TOKEN_FOR_TEST_TOKEN_2',
                        })
                        .expect('Content-Type', /json/)
                        .expect(200, cb);
                }],
            done);
        });
        it('should return 422 on invalid token', (done) => {
            request(app)
                .get('/api/validateToken')
                .query({
                    'token': 'INVALID_TOKEN_STRING',
                })
                .expect('Invalid token.')
                .expect(422, done);
        });
        it('should return 422 on no token specified', (done) => {
            request(app)
                .get('/api/validateToken')
                .expect('Token parameter must be specifed.')
                .expect(422, done);
        });
    });
});
