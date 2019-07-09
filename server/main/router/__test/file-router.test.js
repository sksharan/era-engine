import {expect} from 'chai';
import * as request from 'supertest';
import {app} from '../../app';
import {FileRouterEndpoint} from '../file-router';
import {connectDb, getDb, FileMetadataCollection, FileChunkCollection} from '../../database/index';

const pathToTest = 'main/router/__test';

describe('File router', () => {
    before(async () => {
        await connectDb();
    });

    beforeEach(async () => {
        // Clear all file data from the db
        await getDb()
            .collection(FileMetadataCollection)
            .deleteMany({});
        await getDb()
            .collection(FileChunkCollection)
            .deleteMany({});
    });

    it('should save uploaded files to the database', async () => {
        const files = await uploadFiles();

        const metadata = await getDb()
            .collection(FileMetadataCollection)
            .find({})
            .toArray();
        expect(metadata).to.have.lengthOf(2);

        const metadataIds = metadata.map(m => m._id.toString());
        expect(metadataIds).to.include(files[0]._id);
        expect(metadataIds).to.include(files[1]._id);

        const chunks = await getDb()
            .collection(FileChunkCollection)
            .find({})
            .toArray();
        expect(chunks).to.have.lengthOf(2); // As the files are small, expect a chunk per file
    });

    it('should return bad request if trying to upload 0 files', async () => {
        await request(app)
            .post(FileRouterEndpoint)
            .expect(400);
    });

    it('should allow all file metadata to be fetched', async () => {
        await uploadFiles();
        const res = await request(app)
            .get(`${FileRouterEndpoint}/metadata`)
            .expect(200);
        const metadata = JSON.parse(res.text);
        expect(metadata).to.have.lengthOf(2);
    });

    it('should allow file metadata to be fetched by id', async () => {
        const files = await uploadFiles();

        const res0 = await request(app)
            .get(`${FileRouterEndpoint}/${files[0]._id}/metadata`)
            .expect(200);
        const metadata0 = JSON.parse(res0.text);

        expect(metadata0._id).to.equal(files[0]._id);
        expect(metadata0.filename).to.equal(files[0].filename);

        const res1 = await request(app)
            .get(`${FileRouterEndpoint}/${files[1]._id}/metadata`)
            .expect(200);
        const metadata1 = JSON.parse(res1.text);

        expect(metadata1._id).to.equal(files[1]._id);
        expect(metadata1.filename).to.equal(files[1].filename);
    });

    it('should return bad request if trying to fetch metadata with an invalid id', async () => {
        await request(app)
            .get(`${FileRouterEndpoint}/333333333333/metadata`)
            .expect(400);
    });

    it('should return success when downloading uploaded files', async () => {
        const files = await uploadFiles();
        await request(app)
            .get(`${FileRouterEndpoint}/${files[0]._id}/content`)
            .expect(200);
        await request(app)
            .get(`${FileRouterEndpoint}/${files[1]._id}/content`)
            .expect(200);
    });

    it('should return bad request if trying to fetch content with an invalid id', async () => {
        await request(app)
            .get(`${FileRouterEndpoint}/333333333333/content`)
            .expect(400);
    });
});

async function uploadFiles() {
    const res = await request(app)
        .post(FileRouterEndpoint)
        .attach('light', `${pathToTest}/resources/light.png`, 'light.png')
        .attach('debug', `${pathToTest}/resources/debug.png`, 'debug.png')
        .expect(201);

    const files = JSON.parse(res.text);
    expect(files).to.have.lengthOf(2);
    expect(files[0]._id).to.not.be.null;
    expect(files[0].filename).to.equal('light.png');
    expect(files[1]._id).to.not.be.null;
    expect(files[1].filename).to.equal('debug.png');
    return files;
}
