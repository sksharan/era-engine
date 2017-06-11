import app from '../../app';
import request from 'supertest';

const endpoint = '/regions';

describe('GET ' + endpoint, () => {
    it('returns a successful response', (done) => {
        request(app)
            .get(endpoint)
            .expect(200, done);
    });
});
