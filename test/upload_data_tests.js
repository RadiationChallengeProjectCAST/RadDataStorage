const request = require('supertest');
const { app } = require('../index.js');

describe('POST upload_data tests', () => {
    describe('POST valid json', () => {
        it('should return 201', (done) => {
            request(app)
                .post('/api/upload_data')
                .send({
                    'token': 'TEST_TOKEN_FOR_TEST_TOKEN',
                    'cpm': 10000,
                    'floor': 4,
                    'x': 55,
                    'y': 1,
                })
                .expect('Content-Type', /json/)
                .expect(201, {
                    success: true,
                }, done);
        });
    });
    describe('POST json invalid token', () => {
        it('should return 422 invalid token', (done) => {
            request(app)
                .post('/api/upload_data')
                .send({
                    'token': 'TEST_TOKEN_FOR_TEST_TOKEN_INVALID',
                    'cpm': 10000,
                    'floor': 4,
                    'x': 55,
                    'y': 1,
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
    });
    describe('POST json missing token', () => {
        it('should return 422 missing token', (done) => {
            request(app)
                .post('/api/upload_data')
                .send({
                    'cpm': 10000,
                    'floor': 4,
                    'x': 55,
                    'y': 1,
                })
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
