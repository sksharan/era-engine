import {default as chai, expect} from 'chai';
import chaiSubset from 'chai-subset';
import request from 'supertest';
import app from '../../app';
import {connectDb, db, LightCollection} from '../../database'

chai.use(chaiSubset);

describe('Light query', () => {

    const light = {
        name: "Light",
        type: "POINT",
        ambient: {r: 1, g: 0, b: 0, a: 0.25},
        diffuse: {r: 0, g: 1, b: 0, a: 0.50},
        specular: {r: 0, g: 0, b: 1, a: 0.75},
        specularTerm: 100,
        quadraticAttenuation: 1,
        linearAttenuation: 2,
        constantAttenuation: 3
    };

    before(async () => {
        await connectDb();
    });
    beforeEach(function* () {
        // Remove all existing lights from the db
        yield db.collection(LightCollection).deleteMany({});
        // Add a test light - use copy so original object isn't modified
        yield db.collection(LightCollection).insertOne(Object.assign({}, light));
    });

    it('should return correct light values', async () => {
        const res = await request(app)
            .post('/graphql')
            .send({'query': `
                {
                    light {
                        id
                        name
                        type
                        ambient { r g b a }
                        diffuse { r g b a }
                        specular { r g b a }
                        specularTerm
                        quadraticAttenuation
                        linearAttenuation
                        constantAttenuation
                    }
                }
            `})
            .expect(200);

        const data = JSON.parse(res.text).data;
        expect(data.light).to.be.an('array');
        expect(data.light).to.have.lengthOf(1);
        expect(data.light[0]).to.containSubset(light);
        expect(data.light[0].id).to.be.a('string');
    });

});
