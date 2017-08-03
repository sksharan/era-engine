import {expect} from 'chai'
import request from 'supertest'
import app from '../../app'
import {connectDb, db, SceneNodeCollection} from '../../database'
import {SceneNodeSelectFields} from './util/scene-node-util'
import {getLight} from './util/light-util'

describe('Scene node query', () => {
    before(async () => {
        await connectDb();
    });

    beforeEach(async () => {
        await db.collection(SceneNodeCollection).deleteMany({});
    });

    it('should return selected scene nodes ordered by path', async () => {
        await db.collection(SceneNodeCollection).insert({path: '/a'});
        await db.collection(SceneNodeCollection).insert({path: '/a/b'});
        await db.collection(SceneNodeCollection).insert({path: '/a/d'});
        await db.collection(SceneNodeCollection).insert({path: '/a/d/e'});
        await db.collection(SceneNodeCollection).insert({path: '/a/b/c'});
        await db.collection(SceneNodeCollection).insert({path: '/b/a'});
        await db.collection(SceneNodeCollection).insert({path: '/b/a/a'});

        const res = await request(app)
            .post('/graphql')
            .send({'query': `
                {
                    sceneNodes(pathRegex: "^/a") {
                        ${SceneNodeSelectFields}
                    }
                }
            `})
            .expect(200);

        const data = JSON.parse(res.text).data;
        expect(data.sceneNodes).to.have.lengthOf(5);
        expect(data.sceneNodes[0].path).to.equal('/a');
        expect(data.sceneNodes[1].path).to.equal('/a/b');
        expect(data.sceneNodes[2].path).to.equal('/a/b/c');
        expect(data.sceneNodes[3].path).to.equal('/a/d');
        expect(data.sceneNodes[4].path).to.equal('/a/d/e');
    });

    it('should return light content', async () => {
        await db.collection(SceneNodeCollection).insert({path: '/a', content: getLight()});

        const res = await request(app)
            .post('/graphql')
            .send({'query': `
                {
                    sceneNodes(pathRegex: "^/a") {
                        ${SceneNodeSelectFields}
                    }
                }
            `})
            .expect(200);

        const data = JSON.parse(res.text).data;
        expect(data.sceneNodes).to.have.lengthOf(1);
        expect(data.sceneNodes[0].path).to.equal('/a');
        // Test some light-specific properties
        expect(data.sceneNodes[0].content.specularTerm).to.exist;
        expect(data.sceneNodes[0].content.quadraticAttenuation).to.exist;
    });
});
