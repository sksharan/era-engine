import {expect} from 'chai'
import request from 'supertest'
import app from '../../app'
import {connectDb, db, FileMetadataCollection, FileChunkCollection} from '../../database'
import {ObjectRouterEndpoint} from '../object-router'

const pathToTest = 'main/router/__test';

describe('Object router', () => {
    before(async () => {
        await connectDb();
    });

    beforeEach(async () => {
        // Clear all file data from the db
        await db.collection(FileMetadataCollection).deleteMany({});
        await db.collection(FileChunkCollection).deleteMany({});
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

    it('should store uploaded zip file in the database', async () => {
        await request(app)
            .post(ObjectRouterEndpoint)
            .attach('spider', `${pathToTest}/resources/assimp-spider.zip`, 'assimp-spider.zip');

        const metadata = await db.collection(FileMetadataCollection).find({}).toArray();
        expect(metadata).to.have.lengthOf(1);
        expect(metadata[0].filename).to.equal('assimp-spider.zip');

        const chunks = await db.collection(FileChunkCollection).find({}).toArray();
        expect(chunks.length).to.be.above(0);
    });
});
