import * as express from 'express'
import {ObjectService, SceneNodeService} from '../service/index'
import {SceneNode} from '../type/index'

const router = express.Router();

export const SceneNodeRouterEndpoint = "/scene-nodes";
export const SceneNodeRouter = router;

const defaultPathRegex = '.*';

router.get('/', async (req, res) => {
    const pathRegex = req.query.pathRegex || defaultPathRegex;
    const sceneNodes = await SceneNodeService.getSceneNodes(pathRegex);
    res.status(200).json(sceneNodes);
});

router.post('/', async (req, res) => {
    const sceneNode : SceneNode = req.body;
    const errors : string[] = await validateSceneNode(sceneNode);
    if (errors.length > 0) {
        res.status(400).json({errors});
        return;
    }
    const savedSceneNode : SceneNode = await SceneNodeService.saveSceneNode(sceneNode);
    res.status(201).json(savedSceneNode);
});
async function validateSceneNode(sceneNode: SceneNode) : Promise<string[]> {
    const errors : string[] = [];
    if (sceneNode.type === 'OBJECT') {
        errors.push(`Cannot create object scene nodes through this endpoint`);
    }
    if (sceneNode.type === 'OBJECT_REF') {
        const doc : SceneNode = await SceneNodeService.getSceneNode(sceneNode.content.objectSceneNodeId);
        if (doc === null) {
            errors.push(`No scene node with id ${sceneNode.content.objectSceneNodeId}`);
        } else if (!doc.path.startsWith(ObjectService.ObjectSceneNodePrefix)) {
            errors.push('Scene node detected, but is not valid object scene node');
        }
    }
    return errors;
}

router.delete('/', async (req, res) => {
    const pathRegex = req.query.pathRegex || defaultPathRegex;
    const deletedSceneNodes = await SceneNodeService.deleteSceneNodes(pathRegex);
    res.status(200).json(deletedSceneNodes);
});

