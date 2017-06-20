import {default as chai, expect} from 'chai';
import chaiSubset from 'chai-subset';
import request from 'supertest';
import stringifyObject from 'stringify-object';
import app from '../../app';
import {LightModel} from '../../model/index';

chai.use(chaiSubset);

const light = {
    name: "Light",
    type: "POINT",
    position: {x: 1, y: 2, z: 3},
    direction: {x: 4, y: 5, z: 6},
    ambient: {r: 1, g: 0, b: 0, a: 0.25},
    diffuse: {r: 0, g: 1, b: 0, a: 0.50},
    specular: {r: 0, g: 0, b: 1, a: 0.75},
    attenuation: 0.35
};

async function saveLight(light, id=null) {
    light = Object.assign({}, light);
    if (id) {
        light.id = id;
    }
    // Light object in mutation cannot have quotes around the object keys
    const lightString = stringifyObject(light, {singleQuotes: false});

    const response = await request(app)
        .post('/graphql')
        .send({'query': `
            mutation {
                saveLight(light: ${lightString}) {
                    id
                    name
                    type
                    position { x y z }
                    direction { x y z }
                    ambient { r g b a }
                    diffuse { r g b a }
                    specular { r g b a }
                    attenuation
                }
            }
        `})
        .expect(200);

    // Check that valid light is returned in response
    const data = JSON.parse(response.text).data;
    expect(data.saveLight).to.containSubset(light);
    expect(data.saveLight.id).to.be.a('string');
    if (id) {
        expect(data.saveLight.id).to.equal(id);
    }

    // Check that light data is in db
    const lights = await LightModel.find({});
    expect(lights).to.have.lengthOf(1);
    expect(lights[0]).to.containSubset(light);
    expect(lights[0].id).to.be.a('string');
    if (id) {
        expect(lights[0].id).to.equal(id);
    }
}

describe('Save light mutation', () => {
    beforeEach(async () => {
        // Remove all existing lights from the db
        await LightModel.remove({});
    });
    it('should create a new light if an id is not provided', async () => {
        await saveLight(light);
    });
    it('should create a new light if an unknown id is provided', async () => {
        const id = '5944c6b08b1ea228e823f354';
        await saveLight(light, id);
    });
    it("should update an existing light if an existing id is provided", async () => {
        const id = '59477ef06fee92742c47a9e4';
        await saveLight(light, id);

        const updatedLight = Object.assign({}, light);
        updatedLight.direction = {x: 1, y: 0, z: -1};
        updatedLight.ambient = {r: 0, g: 1, b: 1, a: 0.30};
        updatedLight.specular = {r: 2, g: 7, b: 8, a: 0.72};

        await saveLight(updatedLight, id);
    });
});

describe('Delete light mutation', () => {
    beforeEach(async () => {
        // Remove all existing lights from the db
        await LightModel.remove({});
    });
    it('should successfully delete a light', async () => {
        const doc = await new LightModel(light).save();

        const response = await request(app)
            .post('/graphql')
            .send({'query': `
                mutation {
                    deleteLight(id: "${doc.id}") {
                        id
                        name
                        type
                        position { x y z }
                        direction { x y z }
                        ambient { r g b a }
                        diffuse { r g b a }
                        specular { r g b a }
                        attenuation
                    }
                }
            `})
            .expect(200);

        // Check that valid light is returned in response
        const data = JSON.parse(response.text).data;
        expect(data.deleteLight).to.containSubset(light);
        expect(data.deleteLight.id).to.be.a('string');
        expect(data.deleteLight.id).to.equal(doc.id);

        // Check that no more lights are in the db
        const lights = await LightModel.find({});
        expect(lights).to.have.lengthOf(0);
    });
});
