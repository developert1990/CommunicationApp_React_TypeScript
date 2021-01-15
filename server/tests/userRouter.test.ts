import request from 'supertest';
import { server } from '../index';


describe('Testing API - user routes', () => {
    afterAll(() => {
        server.close();
    });

    test('/users/register', async (done) => {
        const response = await request(server).get('/users/register');
        expect(response.status).toBe(200);
        done();
    })

})