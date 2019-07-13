import {RenderNode} from '../../node/index';
import {vec3} from 'gl-matrix';

export const colorGeometryNodes = (node, color = vec3.create()) => {
    if (!(node instanceof RenderNode)) {
        throw new TypeError('Node must be a SceneNode');
    }
    if (node.nodeType === 'GEOMETRY') {
        node.material.color = color;
    }
    if (node.children) {
        node.children.forEach(child => colorGeometryNodes(child, color));
    }
};
