import {default as chai, expect} from 'chai';
import chaiSubset from 'chai-subset';
import request from 'supertest';
import stringifyObject from 'stringify-object';
import app from '../../app';
import {connectDb, db, LightCollection} from '../../database';

chai.use(chaiSubset);

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

    // Check that valid light is returned in response
    const data = JSON.parse(response.text).data;
    expect(data.saveLight).to.containSubset(light);
    expect(data.saveLight.id).to.be.a('string');
    if (id) {
        expect(data.saveLight.id).to.equal(id);
    }

    // Check that light data is in db
    const lights = await db.collection(LightCollection).find({}).toArray();
    expect(lights).to.have.lengthOf(1);
    lights[0].id = lights[0]._id.toString();
    expect(lights[0]).to.containSubset(light);
    expect(lights[0].id).to.be.a('string');
    if (id) {
        expect(lights[0].id).to.equal(id);
    }
}

describe('Save light mutation', () => {
    before(async () => {
        await connectDb();
    });
    beforeEach(function* () {
        // Remove all existing lights from the db
        yield db.collection(LightCollection).deleteMany({});
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
        updatedLight.ambient = {r: 0, g: 1, b: 1, a: 0.30};
        updatedLight.specular = {r: 2, g: 7, b: 8, a: 0.72};

        await saveLight(updatedLight, id);
    });
});

describe('Delete light mutation', () => {
    before(async () => {
        await connectDb();
    });
    beforeEach(function* () {
        // Remove all existing lights from the db
        yield db.collection(LightCollection).deleteMany({});
    });
    it('should successfully delete a light', async () => {
        const lightCopy = Object.assign({}, light); // Need a copy to avoid adding _id to original light
        await db.collection(LightCollection).insertOne(lightCopy);

        const response = await request(app)
            .post('/graphql')
            .send({'query': `
                mutation {
                    deleteLight(id: "${lightCopy._id.toString()}") {
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

        // Check that valid light is returned in response
        const data = JSON.parse(response.text).data;
        expect(data.deleteLight).to.containSubset(light);
        expect(data.deleteLight.id).to.be.a('string');
        expect(data.deleteLight.id).to.equal(lightCopy._id.toString());

        // Check that no more lights are in the db
        const lights = await db.collection(LightCollection).find({}).toArray();
        expect(lights).to.have.lengthOf(0);
    });
});
