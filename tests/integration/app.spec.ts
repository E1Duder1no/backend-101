import request from 'supertest';
import app from '../../src/app';

const httpRequest = request(app);
describe('App Integration Tests', () => {
    it('should return 200 for health check', async () => {
        const response = await httpRequest.get('/health');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Ok' });
    });

    it('should return 404 for unknown routes', async () => {
        const response = await httpRequest.get('/unknown-route');
        expect(response.status).toBe(404);
    });

    it('should serve API documentation in JSON format', async () => {
        const response = await httpRequest.get('/docs.json');
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/application\/json/);
        expect(response.body).toHaveProperty('openapi');
    });

    it('should serve API documentation in YAML format', async () => {
        const response = await httpRequest.get('/docs.yaml');
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/text\/plain/);
        expect(response.text).toContain('openapi: 3.0.0');
    });

    it('should serve API documentation with Swagger UI', async () => {
        const response = await httpRequest.get('/docs');
        expect([200, 301]).toContain(response.status);
        expect(response.headers['content-type']).toMatch(/text\/html/);
    });
});