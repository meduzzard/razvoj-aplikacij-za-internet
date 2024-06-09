const request = require('supertest');
const app = require('./app'); // Uvozimo našo Express aplikacijo

describe('GET /', () => {
    it('should return 200 OK', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('Welcome to Express');
    });
});

describe('GET /nonexistent', () => {
    it('should return 404 Not Found', async () => {
        const res = await request(app).get('/nonexistent');
        expect(res.statusCode).toEqual(404);
    });
});
