import {default as chai, expect} from 'chai';
import chaiSubset from 'chai-subset';
import request from 'supertest';
import app from '../../app';
import {LightModel} from '../../model/index';

chai.use(chaiSubset);

describe('Light query', () => {

    const light = {
        name: "Light",
        type: "POINT",
        position: {x: 1, y: 2, z: 3},
        direction: {x: 4, y: 5, z: 6},
        ambient: {r: 1, g: 0, b: 0, a: 0.25},
        diffuse: {r: 0, g: 1, b: 0, a: 0.50},
        specular: {r: 0, g: 0, b: 1, a: 0.75},
        intensity: 0.35
    };

    beforeEach(async () => {
        // Remove all existing lights from the db, then add a test light
        await LightModel.remove({});
        await new LightModel(light).save();
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
                        position { x y z }
                        direction { x y z }
                        ambient { r g b a }
                        diffuse { r g b a }
                        specular { r g b a }
                        intensity
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
