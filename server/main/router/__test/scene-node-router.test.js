import {expect} from 'chai'
import * as request from 'supertest'
import {app} from '../../app'
import {SceneNodeRouterEndpoint} from '../scene-node-router'
import {connectDb, getDb, SceneNodeCollection} from '../../database/index'
import {getLight, getSceneNode} from './util/scene-node-util'

describe('Scene node router', () => {
    before(async () => {
        await connectDb();
    });

    beforeEach(async () => {
        await getDb().collection(SceneNodeCollection).deleteMany({});
    });

    it('should allow scene nodes to be created and fetched, ordered by path', async () => {
        for (let path of ['/a', '/a/b', '/a/d', '/a/d/e', '/a/b/c', '/b/a', '/b/a/a']) {
            await request(app)
                .post(SceneNodeRouterEndpoint)
                .send(getSceneNode({name: 'name', path}))
                .expect(201);
        }

        const res = await request(app).get(SceneNodeRouterEndpoint).query({pathRegex: '^/a'}).expect(200);
        const sceneNodes = res.body;
        expect(sceneNodes).to.have.lengthOf(5);
        expect(sceneNodes[0].path).to.equal('/a');
        expect(sceneNodes[1].path).to.equal('/a/b');
        expect(sceneNodes[2].path).to.equal('/a/b/c');
        expect(sceneNodes[3].path).to.equal('/a/d');
        expect(sceneNodes[4].path).to.equal('/a/d/e');
    });

    it('should allow light node to be created and fetched', async () => {
        const lightNode = getSceneNode({name: 'name', path: '/a', type: 'LIGHT'});
        lightNode.content = getLight();
        await request(app).post(SceneNodeRouterEndpoint).send(lightNode).expect(201);

        const res = await request(app).get(SceneNodeRouterEndpoint).query({pathRegex: '^/a'}).expect(200);
        const sceneNodes = res.body;
        expect(sceneNodes).to.have.lengthOf(1);
        expect(sceneNodes[0].path).to.equal('/a');
        // Test some light-specific properties
        expect(sceneNodes[0].content.specularTerm).to.exist;
        expect(sceneNodes[0].content.quadraticAttenuation).to.exist;
    });

    it('should allow existing scene nodes to be updated', async () => {
        let sceneNode = getSceneNode({name: 'name', path: '/a'});
        let res, sceneNodes;

        // Create two scene nodes
        await request(app).post(SceneNodeRouterEndpoint).send(sceneNode).expect(201);
        await request(app).post(SceneNodeRouterEndpoint).send(sceneNode).expect(201);
        res = await request(app).get(SceneNodeRouterEndpoint).query({pathRegex: '^/a'}).expect(200);
        sceneNodes = res.body;
        expect(sceneNodes).to.have.lengthOf(2);

        // Update an existing scene node instead of creating a new one
        sceneNode.id = sceneNodes[0]._id;
        await request(app).post(SceneNodeRouterEndpoint).send(sceneNode).expect(201);
        res = await request(app).get(SceneNodeRouterEndpoint).query({pathRegex: '^/a'}).expect(200);
        sceneNodes = res.body;
        expect(sceneNodes).to.have.lengthOf(2);
    });

    it('should allow a node and its children to be deleted', async () => {
        let res, sceneNodes;

        for (let path of ['/a', '/a/b', '/a/d', '/a/d/e', '/a/b/c']) {
            await request(app)
                .post(SceneNodeRouterEndpoint)
                .send(getSceneNode({name: 'name', path}))
                .expect(201);
        }
        res = await request(app).get(SceneNodeRouterEndpoint).query({pathRegex: '^/a'}).expect(200);
        sceneNodes = res.body;
        expect(sceneNodes).to.have.lengthOf(5); // Initial number of nodes

        res = await request(app).delete(SceneNodeRouterEndpoint).query({pathRegex: '^/a/d'}).expect(200);
        sceneNodes = res.body;
        expect(sceneNodes).to.have.lengthOf(2); // Number of deleted nodes

        res = await request(app).get(SceneNodeRouterEndpoint).query({pathRegex: '^/a'}).expect(200);
        sceneNodes = res.body;
        expect(sceneNodes).to.have.lengthOf(3); // Number of remaining nodes
    });

    it('should succeed saving reference scene node if referenced node exists', async () => {
        await request(app)
            .post(SceneNodeRouterEndpoint)
            .send(getSceneNode({name: 'name', path: '/a'}))
            .expect(201);
        const res = await request(app).get(SceneNodeRouterEndpoint).query({pathRegex: '^/a'}).expect(200);
        const sceneNodes = res.body;
        expect(sceneNodes).to.have.lengthOf(1);

        const refNode = getSceneNode({name: 'name', path: '/a', type: 'REFERENCE'});
        refNode.content = {sceneNodeId: sceneNodes[0]._id};

        await request(app)
            .post(SceneNodeRouterEndpoint)
            .send(refNode)
            .expect(201);
    });

    it('should fail when saving reference scene node if referenced node does not exist', async () => {
        const refNode = getSceneNode({name: 'name', path: '/a', type: 'REFERENCE'});
        refNode.content = {sceneNodeId: '59953ea7d491fa1dc07eee5c'};

        await request(app)
            .post(SceneNodeRouterEndpoint)
            .send(refNode)
            .expect(400, {errors:['No scene node with id 59953ea7d491fa1dc07eee5c']});
    });
});
