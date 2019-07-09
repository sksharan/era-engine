import {GeometryNode} from '../../node/index';

export const findNearestBaseNodeForBoundingBoxNode = boundingBoxNode => {
    if (!(boundingBoxNode instanceof GeometryNode)) {
        throw new TypeError('Node must be a GeometryNode');
    }
    let currNode = boundingBoxNode;
    while (currNode.nodeType !== 'BASE') {
        currNode = currNode.parent;
    }
    return currNode;
};
