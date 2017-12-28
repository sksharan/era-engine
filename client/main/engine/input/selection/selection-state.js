import {testBoundingBoxIntersection} from './intersection'
import {toRay} from './ray'
import {NodeAnalyzer} from '../../node/index'
import {vec3} from 'gl-matrix'

export class SelectionState {
    constructor() {
        if (new.target === SelectionState) {
            throw new Error('Cannot instantiate SelectionState directly');
        }
        this._nodeAnalyzer = new NodeAnalyzer();
    }
    // Action to perform when transitioning into this state
    onEnter(sceneNode) {
        console.warn(`Called onEnter with sceneNode=${sceneNode}`);
    }
    // Returns the next state to transition to, otherwise returns null
    handleDocumentClick(mouseX, mouseY, sceneNode) {
        console.warn(`Called handleDocumentClick with mouseX=${mouseX}, mouseY=${mouseY}, sceneNode=${sceneNode}`);
        return null;
    }
    // Returns the next state to transition to, otherwise returns null
    handleCanvasMouseDown(mouseX, mouseY, sceneNode) {
        console.warn(`Called handleCanvasMouseDown with mouseX=${mouseX}, mouseY=${mouseY}, sceneNode=${sceneNode}`);
        return null;
    }
    // Returns the next state to transition to, otherwise returns null
    handleCanvasMouseUp(mouseX, mouseY, sceneNode) {
        console.warn(`Called handleCanvasMouseUp with mouseX=${mouseX}, mouseY=${mouseY}, sceneNode=${sceneNode}`);
        return null;
    }
    // Returns the next state to transition to, otherwise returns null
    handleCanvasMouseMove(mouseX, mouseY, sceneNode) {
        console.warn(`Called handleCanvasMouseMove with mouseX=${mouseX}, mouseY=${mouseY}, sceneNode=${sceneNode}`);
        return null;
    }
    // Returns the next state to transition to, otherwise returns null
    handleKeyDown(key, sceneNode) {
        console.warn(`Called handleKeyDown with key=${key}, sceneNode=${sceneNode}`);
        return null;
    }
    // Returns the next state to transition to, otherwise returns null
    handleKeyUp(key, sceneNode) {
        console.warn(`Called handleKeyUp with key=${key}, sceneNode=${sceneNode}`);
        return null;
    }
    // Action to perform when transitioning out of this state
    onExit(sceneNode) {
        console.warn(`Called onExit with sceneNode=${sceneNode}`);
    }

    _getNearestIntersection(mouseX, mouseY, sceneNode) {
        this._nodeAnalyzer.analyze(sceneNode);
        const boundingBoxNodes = this._nodeAnalyzer.getAllBoundingBoxNodes();

        const ray = toRay(mouseX, mouseY);
        let closestSelectedNode = null;
        let closestDistance = Number.POSITIVE_INFINITY;

        for (let boundingBoxNode of boundingBoxNodes) {
            let distance = testBoundingBoxIntersection(ray, boundingBoxNode);
            if (distance && distance < closestDistance) {
                closestDistance = distance;
                closestSelectedNode = boundingBoxNode;
            }
        }

        const intersectionPoint = vec3.add(vec3.create(), ray.origin,
                vec3.scale(vec3.create(), ray.direction, closestDistance));

        return {
            boundingBoxNode: closestSelectedNode,
            distance: closestDistance,
            point: intersectionPoint
        };
    }
}
