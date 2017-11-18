import {expect} from 'chai'
import request from 'supertest'
import app from '../../app'
import {ObjectRouterEndpoint,} from '../object-router'
import {SceneNodeRouterEndpoint} from '../scene-node-router'
import {ObjectService} from '../../service/index'
import {connectDb, db, FileMetadataCollection, FileChunkCollection, SceneNodeCollection} from '../../database/index'
import {getSceneNode} from './util/scene-node-util'

const pathToTest = 'main/router/__test';
const ObjectSceneNodePrefix = ObjectService.ObjectSceneNodePrefix;

describe('Object router', () => {
    before(async () => {
        await connectDb();
    });

    beforeEach(async () => {
        await db.collection(FileMetadataCollection).deleteMany({});
        await db.collection(FileChunkCollection).deleteMany({});
        await db.collection(SceneNodeCollection).deleteMany({});
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
            .attach('spider', `${pathToTest}/resources/assimp-spider.zip`, 'assimp-spider.zip')
            .expect(201);
    });

    it('should store zip file contents in the database', async () => {
        await request(app)
            .post(ObjectRouterEndpoint)
            .attach('spider', `${pathToTest}/resources/assimp-spider.zip`, 'assimp-spider.zip');

        const numFilesInZip = 6;
        const metadata = await db.collection(FileMetadataCollection).find({}).toArray();
        expect(metadata).to.have.lengthOf(numFilesInZip);
        const chunks = await db.collection(FileChunkCollection).find({}).toArray();
        expect(chunks.length).to.be.above(numFilesInZip);
    });

    it('should create correct number of total scene nodes from uploaded zip', async () => {
        const sceneNodes = await uploadSpider();
        expect(sceneNodes).to.have.lengthOf(20);
    });

    it('should create correct number of default scene nodes from uploaded zip', async () => {
        const sceneNodes = await uploadSpider();
        const filtered = sceneNodes.filter(sceneNode => sceneNode.type === "DEFAULT");
        expect(filtered.length).to.equal(1);
    });

    it('should create correct number of object scene nodes from uploaded zip', async () => {
        const sceneNodes = await uploadSpider();
        const filtered = sceneNodes.filter(sceneNode => sceneNode.type === "OBJECT");
        expect(filtered.length).to.equal(19);
    });

    it('should create scene nodes with correct names from uploaded zip', async () => {
        const sceneNodes = await uploadSpider();
        // Scene nodes are ordered by path
        expect(sceneNodes[0].name).to.equal(`spider.obj`);
        expect(sceneNodes[1].name).to.equal(`g Auge`);
        expect(sceneNodes[2].name).to.equal(`g Bein1Li`);
        expect(sceneNodes[3].name).to.equal(`g Bein1Re`);
        expect(sceneNodes[4].name).to.equal(`g Bein2Li`);
        expect(sceneNodes[5].name).to.equal(`g Bein2Re`);
        expect(sceneNodes[6].name).to.equal(`g Bein3Li`);
        expect(sceneNodes[7].name).to.equal(`g Bein3Re`);
        expect(sceneNodes[8].name).to.equal(`g Bein4Li`);
        expect(sceneNodes[9].name).to.equal(`g Bein4Re`);
        expect(sceneNodes[10].name).to.equal(`g Brust`);
        expect(sceneNodes[11].name).to.equal(`g Duplicate05`);
        expect(sceneNodes[12].name).to.equal(`g HLeib01`);
        expect(sceneNodes[13].name).to.equal(`g Kopf`);
        expect(sceneNodes[14].name).to.equal(`g Kopf2`);
        expect(sceneNodes[15].name).to.equal(`g OK`);
        expect(sceneNodes[16].name).to.equal(`g Zahn`);
        expect(sceneNodes[17].name).to.equal(`g Zahn2`);
        expect(sceneNodes[18].name).to.equal(`g klZahn`);
        expect(sceneNodes[19].name).to.equal(`g klZahn2`);
    });

    it('should create scene nodes with correct paths from uploaded zip', async () => {
        const sceneNodes = await uploadSpider();
        // Scene nodes are ordered by path
        expect(sceneNodes[0].path).to.equal(`${ObjectSceneNodePrefix}_spider.obj`);
        expect(sceneNodes[1].path).to.equal(`${ObjectSceneNodePrefix}_spider.obj/g Auge`);
        expect(sceneNodes[2].path).to.equal(`${ObjectSceneNodePrefix}_spider.obj/g Bein1Li`);
        expect(sceneNodes[3].path).to.equal(`${ObjectSceneNodePrefix}_spider.obj/g Bein1Re`);
        expect(sceneNodes[4].path).to.equal(`${ObjectSceneNodePrefix}_spider.obj/g Bein2Li`);
        expect(sceneNodes[5].path).to.equal(`${ObjectSceneNodePrefix}_spider.obj/g Bein2Re`);
        expect(sceneNodes[6].path).to.equal(`${ObjectSceneNodePrefix}_spider.obj/g Bein3Li`);
        expect(sceneNodes[7].path).to.equal(`${ObjectSceneNodePrefix}_spider.obj/g Bein3Re`);
        expect(sceneNodes[8].path).to.equal(`${ObjectSceneNodePrefix}_spider.obj/g Bein4Li`);
        expect(sceneNodes[9].path).to.equal(`${ObjectSceneNodePrefix}_spider.obj/g Bein4Re`);
        expect(sceneNodes[10].path).to.equal(`${ObjectSceneNodePrefix}_spider.obj/g Brust`);
        expect(sceneNodes[11].path).to.equal(`${ObjectSceneNodePrefix}_spider.obj/g Duplicate05`);
        expect(sceneNodes[12].path).to.equal(`${ObjectSceneNodePrefix}_spider.obj/g HLeib01`);
        expect(sceneNodes[13].path).to.equal(`${ObjectSceneNodePrefix}_spider.obj/g Kopf`);
        expect(sceneNodes[14].path).to.equal(`${ObjectSceneNodePrefix}_spider.obj/g Kopf2`);
        expect(sceneNodes[15].path).to.equal(`${ObjectSceneNodePrefix}_spider.obj/g OK`);
        expect(sceneNodes[16].path).to.equal(`${ObjectSceneNodePrefix}_spider.obj/g Zahn`);
        expect(sceneNodes[17].path).to.equal(`${ObjectSceneNodePrefix}_spider.obj/g Zahn2`);
        expect(sceneNodes[18].path).to.equal(`${ObjectSceneNodePrefix}_spider.obj/g klZahn`);
        expect(sceneNodes[19].path).to.equal(`${ObjectSceneNodePrefix}_spider.obj/g klZahn2`);
    });

    it('should create scene nodes with correct local matrices from uploaded zip', async () => {
        const sceneNodes = await uploadSpider();
        for (let sceneNode of sceneNodes) {
            expect(sceneNode.localMatrix).to.eql([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
        }
    });

    it('should create scene nodes with correct content from uploaded zip', async () => {
        const sceneNodes = await uploadSpider();
        expect(sceneNodes[0].content).to.be.not.null;
        expect(sceneNodes[12].content).to.be.not.null;
        expect(sceneNodes[12].content.positions.length).to.equal(213);
        expect(sceneNodes[12].content.positions[0]).to.equal(1.16038);
        expect(sceneNodes[12].content.positions[1]).to.equal(4.51268);
        expect(sceneNodes[12].content.positions[2]).to.equal(6.44917);
        expect(sceneNodes[12].content.normals.length).to.equal(213);
        expect(sceneNodes[12].content.normals[0]).to.equal(-0.537588);
        expect(sceneNodes[12].content.normals[1]).to.equal(-0.071798);
        expect(sceneNodes[12].content.normals[2]).to.equal(0.840146);
        expect(sceneNodes[12].content.texcoords.length).to.equal(142);
        expect(sceneNodes[12].content.texcoords[0]).to.equal(0.186192);
        expect(sceneNodes[12].content.texcoords[1]).to.equal(0.222718);
        expect(sceneNodes[12].content.indices.length).to.equal(240);
        expect(sceneNodes[12].content.ambient.r).to.equal(0.2);
        expect(sceneNodes[12].content.ambient.g).to.equal(0.2);
        expect(sceneNodes[12].content.ambient.b).to.equal(0.2);
        expect(sceneNodes[12].content.diffuse.r).to.equal(0.690196);
        expect(sceneNodes[12].content.diffuse.g).to.equal(0.639216);
        expect(sceneNodes[12].content.diffuse.b).to.equal(0.615686);
        expect(sceneNodes[12].content.specular.r).to.equal(0);
        expect(sceneNodes[12].content.specular.g).to.equal(0);
        expect(sceneNodes[12].content.specular.b).to.equal(0);
        expect(sceneNodes[12].content.shininess).to.equal(0);
        expect(sceneNodes[12].content.textureFileId).to.be.not.null;
    });

    it('should allow object ref scene node to be created after zip is uploaded', async() => {
        const sceneNodes = await uploadSpider();
        const node = getSceneNode({name: 'a', path: '/a'});
        node.objectSceneNodeId = sceneNodes[0].id;
        await request(app)
            .post(SceneNodeRouterEndpoint)
            .send(node)
            .expect(201);
    });
});

async function uploadSpider() {
    await request(app)
        .post(ObjectRouterEndpoint)
        .attach('spider', `${pathToTest}/resources/assimp-spider.zip`, 'assimp-spider.zip')
        .expect(201);

    const res = await request(app)
        .get(SceneNodeRouterEndpoint)
        .query({pathRegex: '.*'}) // Get all scene nodes
        .expect(200);

    return res.body;
}
