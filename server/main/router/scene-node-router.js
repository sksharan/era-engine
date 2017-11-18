import express from 'express'
import {ObjectService, SceneNodeService} from '../service/index'
import {LightType, SceneNodeType} from '../enum/index'

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
    const sceneNode = req.body;
    const errors = await validateSceneNode(sceneNode);
    if (errors.length > 0) {
        res.status(400).json({errors});
        return;
    }
    const savedSceneNode = await SceneNodeService.saveSceneNode(sceneNode);
    res.status(201).json(savedSceneNode);
});
// TODO: add a type system like Flow or TypeScript for more in-depth validation
async function validateSceneNode(sceneNode) {
    if (!sceneNode) {
        return ['No scene node specified'];
    }
    const errors = [];
    if (!SceneNodeType.isValidType(sceneNode.type)) {
        errors.push(`Invalid scene node type specified: ${sceneNode.type}`);
    }
    if (sceneNode.type === SceneNodeType.DEFAULT && sceneNode.content) {
        errors.push(`${SceneNodeType.DEFAULT} nodes must not have any content`);
    }
    if (sceneNode.type === SceneNodeType.LIGHT && !LightType.isValidType(sceneNode.content.type)) {
        errors.push(`Invalid scene node light type specified: ${sceneNode.content.type}`);
    }
    if (sceneNode.type === SceneNodeType.OBJECT) {
        errors.push(`Cannot create ${SceneNodeType.OBJECT} node through this endpoint`);
    }
    if (sceneNode.type === SceneNodeType.OBJECT_REF) {
        const doc = await SceneNodeService.getSceneNode(sceneNode.content.objectSceneNodeId);
        if (doc === null) {
            errors.push(`No scene node with id ${sceneNode.content.objectSceneNodeId}`);
        } else if (!doc.path.startsWith(ObjectService.ObjectSceneNodePrefix)) {
            errors.push('Scene node detected, but is not valid object scene node');
        }
    }
    if (sceneNode.localMatrix.length !== 16) {
        errors.push(`Expected 16 elements in local matrix but got ${sceneNode.localMatrix.length}`);
    }
    return errors;
}

router.delete('/', async (req, res) => {
    const pathRegex = req.query.pathRegex || defaultPathRegex;
    const deletedSceneNodes = await SceneNodeService.deleteSceneNodes(pathRegex);
    res.status(200).json(deletedSceneNodes);
});

