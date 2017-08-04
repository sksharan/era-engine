import {expect} from 'chai'
import request from 'supertest'
import app from '../../app'
import {connectDb, db, SceneNodeCollection} from '../../database'
import {SceneNodeSelectFields} from './util/scene-node-util'
import {getLight, stringifyLight} from './util/light-util'

function getSceneNode({id, name, path}) {
    return `{
        ${id ? `id: "${id}",` : ""}
        name: "${name}",
        type: "None",
        localMatrix: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        path: "${path}"
    }`;
}
function validateSceneNode(sceneNode, {id, name, path}, content=null) {
    if (id) {
        expect(sceneNode.id).to.equal(id);
    } else {
        expect(sceneNode.id).to.not.be.null;
    }
    expect(sceneNode.name).to.equal(name);
    expect(sceneNode.type).to.equal('None');
    expect(sceneNode.localMatrix).to.eql([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    expect(sceneNode.path).to.equal(path);
    expect(sceneNode.content).to.eql(content);
}

describe('Scene node mutation', () => {
    before(async () => {
        await connectDb();
    });

    beforeEach(async () => {
        await db.collection(SceneNodeCollection).deleteMany({});
    });

    it('should allow insertion of new scene nodes', async () => {
        const node0 = {name: 'a', path: '/a'};
        const res0 = await request(app)
            .post('/graphql')
            .send({'query': `
                mutation {
                    saveSceneNode(sceneNode: ${getSceneNode(node0)}) {
                        ${SceneNodeSelectFields}
                    }
                }
            `})
            .expect(200);

        const node1 = {name: 'abc', path: '/a/b/c'};
        const res1 = await request(app)
            .post('/graphql')
            .send({'query': `
                mutation {
                    saveSceneNode(sceneNode: ${getSceneNode(node1)}) {
                        ${SceneNodeSelectFields}
                    }
                }
            `})
            .expect(200);

        // Validate responses
        validateSceneNode(JSON.parse(res0.text).data.saveSceneNode, node0);
        validateSceneNode(JSON.parse(res1.text).data.saveSceneNode, node1);

        // Validate db contents
        const cursor = await db.collection(SceneNodeCollection).find({}).sort({path: 1});
        const sceneNodes = await cursor.toArray();
        expect(sceneNodes).to.have.lengthOf(2);
        validateSceneNode(sceneNodes[0], node0);
        validateSceneNode(sceneNodes[1], node1);
    });

    it('should allow existing scene nodes to be updated', async () => {
        const node0 = {name: 'a', path: '/a'};
        const res0 = await request(app)
            .post('/graphql')
            .send({'query': `
                mutation {
                    saveSceneNode(sceneNode: ${getSceneNode(node0)}) {
                        ${SceneNodeSelectFields}
                    }
                }
            `})
            .expect(200);
        const res0Data = JSON.parse(res0.text).data.saveSceneNode;

        // This will update the existing node instead of creating a new one
        const node1 = {id: res0Data.id, name: 'abc', path: '/a'};
        const res1 = await request(app)
            .post('/graphql')
            .send({'query': `
                mutation {
                    saveSceneNode(sceneNode: ${getSceneNode(node1)}) {
                        ${SceneNodeSelectFields}
                    }
                }
            `})
            .expect(200);

        // Validate responses
        validateSceneNode(res0Data, node0);
        validateSceneNode(JSON.parse(res1.text).data.saveSceneNode, node1);

        // Validate db contents
        const cursor = await db.collection(SceneNodeCollection).find({}).sort({path: 1});
        const sceneNodes = await cursor.toArray();
        expect(sceneNodes).to.have.lengthOf(1);
        validateSceneNode(sceneNodes[0], node1);
    });

    it('should allow a light node to be saved', async () => {
        const node = {name: 'a', path: '/a'};
        let content = getLight();
        content.id = null;
        const res = await request(app)
            .post('/graphql')
            .send({'query': `
                mutation {
                    saveLightSceneNode(sceneNode: ${getSceneNode(node)}, content: ${stringifyLight(content)}) {
                        ${SceneNodeSelectFields}
                    }
                }
            `})
            .expect(200);

        // Validate response
        validateSceneNode(JSON.parse(res.text).data.saveLightSceneNode, node, content);

        // Validate db contents
        const cursor = await db.collection(SceneNodeCollection).find({}).sort({path: 1});
        const sceneNodes = await cursor.toArray();
        expect(sceneNodes).to.have.lengthOf(1);
        validateSceneNode(sceneNodes[0], node, content);
    });

    it('should allow a node and its children to be deleted', async () => {
        await db.collection(SceneNodeCollection).insert({path: '/a'});
        await db.collection(SceneNodeCollection).insert({path: '/a/b'});
        await db.collection(SceneNodeCollection).insert({path: '/a/d'});
        await db.collection(SceneNodeCollection).insert({path: '/a/d/e'});
        await db.collection(SceneNodeCollection).insert({path: '/a/b/c'});
        await db.collection(SceneNodeCollection).insert({path: '/b/a/d'});

        const res = await request(app)
            .post('/graphql')
            .send({'query': `
                mutation {
                    deleteSceneNodes(pathRegex: "^/a/d") {
                        ${SceneNodeSelectFields}
                    }
                }
            `})
            .expect(200);

        // Validate response
        const data = JSON.parse(res.text).data.deleteSceneNodes;
        expect(data).to.have.lengthOf(2); // Number of deleted nodes

        // Validate remaining db contents
        const cursor = await db.collection(SceneNodeCollection).find({}).sort({path: 1});
        const sceneNodes = await cursor.toArray();
        expect(sceneNodes).to.have.lengthOf(4);
    });

});
