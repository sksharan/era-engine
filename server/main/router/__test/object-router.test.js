import {expect} from 'chai'
import * as request from 'supertest'
import {app} from '../../app'
import {ObjectRouterEndpoint,} from '../object-router'
import {SceneNodeRouterEndpoint} from '../scene-node-router'
import {connectDb, getDb, FileMetadataCollection, FileChunkCollection, SceneNodeCollection} from '../../database/index'
import {getSceneNode} from './util/scene-node-util'

const pathToTest = 'main/router/__test';
const objectSceneNodePrefix = '__object_';

describe('Object router', () => {
    before(async () => {
        await connectDb();
    });

    beforeEach(async () => {
        await getDb().collection(FileMetadataCollection).deleteMany({});
        await getDb().collection(FileChunkCollection).deleteMany({});
        await getDb().collection(SceneNodeCollection).deleteMany({});
    });

    it('should return bad request if uploading zero assets', async () => {
        await request(app)
            .post(ObjectRouterEndpoint)
            .expect(400)
            .expect('Must specify exactly one file');
    });

    it('should return bad request if uploading more than one asset', async () => {
        await request(app)
            .post(ObjectRouterEndpoint)
            .attach('light', `${pathToTest}/resources/light.png`, 'light.png')
            .attach('debug', `${pathToTest}/resources/debug.png`, 'debug.png')
            .expect(400)
            .expect('Must specify exactly one file');
    });

    it('should return bad request if uploading a non-zip file', async () => {
        await request(app)
            .post(ObjectRouterEndpoint)
            .attach('light', `${pathToTest}/resources/light.png`, 'light.png')
            .expect(400)
            .expect("Uploaded file 'light.png' is not a zip file");
    });

    it('should accept a single zip file', async () => {
        await request(app)
            .post(ObjectRouterEndpoint)
            .attach('cubes', `${pathToTest}/resources/cubes.zip`, 'cubes.zip')
            .expect(201);
    });

    it('should store zip file contents in the database', async () => {
        await request(app)
            .post(ObjectRouterEndpoint)
            .attach('cubes', `${pathToTest}/resources/cubes.zip`, 'cubes.zip');

        const numFilesInZip = 2; // cubes.json and default.png
        const metadata = await getDb().collection(FileMetadataCollection).find({}).toArray();
        expect(metadata).to.have.lengthOf(numFilesInZip);
        const chunks = await getDb().collection(FileChunkCollection).find({}).toArray();
        expect(chunks.length).to.equal(numFilesInZip);
    });

    it('should create correct number of total scene nodes from uploaded zip', async () => {
        const sceneNodes = await uploadCubes();
        expect(sceneNodes).to.have.lengthOf(4);
    });
    it('should create correct number of default scene nodes from uploaded zip', async () => {
        const sceneNodes = await uploadCubes();
        const filtered = sceneNodes.filter(sceneNode => sceneNode.type === "DEFAULT");
        expect(filtered.length).to.equal(1);
    });
    it('should create correct number of object scene nodes from uploaded zip', async () => {
        const sceneNodes = await uploadCubes();
        const filtered = sceneNodes.filter(sceneNode => sceneNode.type === "OBJECT");
        expect(filtered.length).to.equal(3);
    });

    it('should create scene nodes with correct names from uploaded zip', async () => {
        const sceneNodes = await uploadCubes();
        // Scene nodes are ordered by path
        expect(sceneNodes[0].name).to.equal('Cubes');
        expect(sceneNodes[1].name).to.equal('Cube_1');
        expect(sceneNodes[2].name).to.equal('Cube_2');
        expect(sceneNodes[3].name).to.equal('Cube_3');
    });

    it('should create scene nodes with correct paths from uploaded zip', async () => {
        const sceneNodes = await uploadCubes();
        // Scene nodes are ordered by path
        expect(sceneNodes[0].path).to.equal(`${objectSceneNodePrefix}Cubes`);
        expect(sceneNodes[1].path).to.equal(`${objectSceneNodePrefix}Cubes/Cube_1`);
        expect(sceneNodes[2].path).to.equal(`${objectSceneNodePrefix}Cubes/Cube_2`);
        expect(sceneNodes[3].path).to.equal(`${objectSceneNodePrefix}Cubes/Cube_3`);
    });

    it('should create scene nodes with correct local matrices from uploaded zip', async () => {
        const sceneNodes = await uploadCubes();
        for (let sceneNode of sceneNodes) {
            expect(sceneNode.localMatrix).to.eql([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
        }
    });

    it('should create scene nodes with non-null content', async () => {
        const sceneNodes = await uploadCubes();
        expect(sceneNodes[0].content).to.be.not.null;
        expect(sceneNodes[1].content).to.be.not.null;
        expect(sceneNodes[2].content).to.be.not.null;
        expect(sceneNodes[3].content).to.be.not.null;
    });

    it('should allow object ref scene node to be created after zip is uploaded', async() => {
        const sceneNodes = await uploadCubes();
        const node = getSceneNode({name: 'a', path: '/a'});
        node.objectSceneNodeId = sceneNodes[0].id;
        await request(app)
            .post(SceneNodeRouterEndpoint)
            .send(node)
            .expect(201);
    });
});

async function uploadCubes() {
    await request(app)
        .post(ObjectRouterEndpoint)
        .field('prefix', objectSceneNodePrefix)
        .attach('cubes', `${pathToTest}/resources/cubes.zip`, 'cubes.zip')
        .expect(201);

    const res = await request(app)
        .get(SceneNodeRouterEndpoint)
        .query({pathRegex: '.*'}) // Get all scene nodes
        .expect(200);

    return res.body;
}
