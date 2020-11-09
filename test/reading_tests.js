const request = require('supertest');
const { app } = require('../index.js');

describe('GET api/readings', () => {
    describe('GET valid json', () => {
        it('should return 200 and type json', (done) => {
            request(app)
                .get('/api/readings')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });
});
