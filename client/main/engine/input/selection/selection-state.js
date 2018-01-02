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
    onEnter(renderNode) {
        console.warn(`Called onEnter with renderNode=${renderNode}`);
    }
    // Returns the next state to transition to, otherwise returns null
    handleDocumentClick(mouseX, mouseY, renderNode) {
        console.warn(`Called handleDocumentClick with mouseX=${mouseX}, mouseY=${mouseY}, renderNode=${renderNode}`);
        return null;
    }
    // Returns the next state to transition to, otherwise returns null
    handleCanvasMouseDown(mouseX, mouseY, renderNode) {
        console.warn(`Called handleCanvasMouseDown with mouseX=${mouseX}, mouseY=${mouseY}, renderNode=${renderNode}`);
        return null;
    }
    // Returns the next state to transition to, otherwise returns null
    handleCanvasMouseUp(mouseX, mouseY, renderNode) {
        console.warn(`Called handleCanvasMouseUp with mouseX=${mouseX}, mouseY=${mouseY}, renderNode=${renderNode}`);
        return null;
    }
    // Returns the next state to transition to, otherwise returns null
    handleCanvasMouseMove(mouseX, mouseY, renderNode) {
        console.warn(`Called handleCanvasMouseMove with mouseX=${mouseX}, mouseY=${mouseY}, renderNode=${renderNode}`);
        return null;
    }
    // Returns the next state to transition to, otherwise returns null
    handleKeyDown(key, renderNode) {
        console.warn(`Called handleKeyDown with key=${key}, renderNode=${renderNode}`);
        return null;
    }
    // Returns the next state to transition to, otherwise returns null
    handleKeyUp(key, renderNode) {
        console.warn(`Called handleKeyUp with key=${key}, renderNode=${renderNode}`);
        return null;
    }
    // Action to perform when transitioning out of this state
    onExit(renderNode) {
        console.warn(`Called onExit with renderNode=${renderNode}`);
    }

    _getNearestIntersection(mouseX, mouseY, renderNode) {
        this._nodeAnalyzer.analyze(renderNode);
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
