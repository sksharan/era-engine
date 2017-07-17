export default class NodeAnalyzer {
    constructor() {
        this._lightNodes = [];
    }

    analyze(sceneNode) {
        analyzeLightNodes.call(this, sceneNode);
    }

    getLightNodes() {
        return this._lightNodes;
    }
}

// http://math.hws.edu/graphicsbook/c4/s4.html - see "Moving Light"
function analyzeLightNodes(sceneNode) {
    this._lightNodes = [];
    populateLightNodes(sceneNode, this._lightNodes);
}

function populateLightNodes(sceneNode, lightNodes) {
    if (sceneNode.nodeType === "LIGHT") {
        lightNodes.push(sceneNode);
    }
    for (let child of sceneNode.children) {
        populateLightNodes(child, lightNodes);
    }
}
