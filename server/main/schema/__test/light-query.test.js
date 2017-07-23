import {default as chai, expect} from 'chai';
import chaiSubset from 'chai-subset';
import request from 'supertest';
import app from '../../app';
import {connectDb, db, LightCollection} from '../../database'
import {getLight, LightSelectFields} from './util/light-util'

chai.use(chaiSubset);

describe('Light query', () => {
    before(async () => {
        await connectDb();
    });
    beforeEach(function* () {
        // Remove all existing lights from the db
        yield db.collection(LightCollection).deleteMany({});
        // Add a test light - use copy so original object isn't modified
        yield db.collection(LightCollection).insertOne(getLight());
    });

    it('should return correct light values', async () => {
        const res = await request(app)
            .post('/graphql')
            .send({'query': `
                {
                    light {
                        ${LightSelectFields}
                    }
                }
            `})
            .expect(200);

        const data = JSON.parse(res.text).data;
        expect(data.light).to.be.an('array');
        expect(data.light).to.have.lengthOf(1);
        expect(data.light[0]).to.containSubset(getLight());
        expect(data.light[0].id).to.be.a('string');
    });

});
