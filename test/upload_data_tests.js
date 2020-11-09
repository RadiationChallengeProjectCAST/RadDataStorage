const request = require('supertest');
const { app } = require('../index.js');

describe('POST upload_data tests', () => {
    describe('POST valid json', () => {
        it('should return 201', (done) => {
            request(app)
                .post('/api/upload_data')
                .send({
                    'token': 'TEST_TOKEN_FOR_TEST_TOKEN',
                    'reading': {
                        'cpm': 10000,
                        'location': {
                            'floor': 4,
                            'x': 55,
                            'y': 1,
                        },
                    },
                })
                .expect(201, done);
        });
    });
});
