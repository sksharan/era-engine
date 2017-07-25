import {default as chai, expect} from 'chai';
import chaiSubset from 'chai-subset';
import request from 'supertest';
import app from '../../app';
import {connectDb, db, LightCollection} from '../../database';
import {getLight, stringifyLight, LightSelectFields} from './util/light-util';

chai.use(chaiSubset);

async function saveLight(light) {
    const lightString = stringifyLight(light);

    const response = await request(app)
        .post('/graphql')
        .send({'query': `
            mutation {
                saveLight(light: ${lightString}) {
                    ${LightSelectFields}
                }
            }
        `})
        .expect(200);

    // Check that valid light is returned in response
    const data = JSON.parse(response.text).data;
    expect(data.saveLight).to.containSubset(light);
    expect(data.saveLight.id).to.be.a('string');
    if (light.id) {
        expect(data.saveLight.id).to.equal(light.id);
    }

    // Check that light data is in db
    const lights = await db.collection(LightCollection).find({}).toArray();
    expect(lights).to.have.lengthOf(1);
    lights[0].id = lights[0]._id.toString();
    expect(lights[0]).to.containSubset(light);
    expect(lights[0].id).to.be.a('string');
    if (light.id) {
        expect(lights[0].id).to.equal(light.id);
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
        await saveLight(getLight());
    });
    it('should create a new light if an unknown id is provided', async () => {
        const id = '5944c6b08b1ea228e823f354';
        await saveLight(getLight(id));
    });
    it("should update an existing light if an existing id is provided", async () => {
        const id = '59477ef06fee92742c47a9e4';
        await saveLight(getLight(id));

        const updatedLight = getLight(id);
        // Update any set of light fields
        updatedLight.ambient = {r: 0, g: 1, b: 1, a: 0.30};
        updatedLight.specular = {r: 2, g: 7, b: 8, a: 0.72};

        await saveLight(getLight(id, updatedLight));
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
        const light = getLight();
        await db.collection(LightCollection).insertOne(light);

        const response = await request(app)
            .post('/graphql')
            .send({'query': `
                mutation {
                    deleteLight(id: "${light._id.toString()}") {
                        ${LightSelectFields}
                    }
                }
            `})
            .expect(200);

        // Check that valid light is returned in response
        const data = JSON.parse(response.text).data;
        expect(data.deleteLight).to.containSubset(getLight());
        expect(data.deleteLight.id).to.be.a('string');
        expect(data.deleteLight.id).to.equal(light._id.toString());

        // Check that no more lights are in the db
        const lights = await db.collection(LightCollection).find({}).toArray();
        expect(lights).to.have.lengthOf(0);
    });
});
