export default class NodeAnalyzer {
    constructor() {
        this._allLightNodes = [];
        this._allProgramData = {};
    }

    analyze(sceneNode) {
        analyzeLightNodes.call(this, sceneNode);
        analyzeProgramData.call(this, sceneNode);
    }

    getAllLightNodes() {
        return this._allLightNodes;
    }

    getAllProgramData() {
        return Object.values(this._allProgramData);
    }
}

// http://math.hws.edu/graphicsbook/c4/s4.html - see "Moving Light"
function analyzeLightNodes(sceneNode) {
    this._allLightNodes = [];
    populateLightNodes(sceneNode, this._allLightNodes);
}

function populateLightNodes(sceneNode, lightNodes) {
    if (sceneNode.nodeType === "LIGHT") {
        lightNodes.push(sceneNode);
    }
    for (let child of sceneNode.children) {
        populateLightNodes(child, lightNodes);
    }
}

function analyzeProgramData(sceneNode) {
    this._allProgramData = {};
    populateProgramData(sceneNode, this._allProgramData);
}

function populateProgramData(sceneNode, allProgramData) {
    if (sceneNode.nodeType === "GEOMETRY") {
        allProgramData[sceneNode.material.programData.id] = sceneNode.material.programData;
    }
    for (let child of sceneNode.children) {
        populateProgramData(child, allProgramData);
    }
}
