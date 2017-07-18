/* Provides high-level information about a scene graph.
 * Call analyze(), then call any get*() method to get the
 * results of the analysis.
 */
export default class NodeAnalyzer {
    constructor() {
        this._allLightNodes = [];
        this._allProgramData = {};
    }

    // Collect data about the scene graph by traversing every node.
    // Previous analysis results are overwritten.
    analyze(sceneNode) {
        beginAnalysis.call(this, sceneNode);
    }

    // Get the light scene nodes detected by the analysis
    getAllLightNodes() {
        return this._allLightNodes;
    }

    // Get the program data object detected by the analysis
    getAllProgramData() {
        return Object.values(this._allProgramData);
    }
}

// Having an analysis 'first-pass' step is useful for lighting, as discussed
// here: http://math.hws.edu/graphicsbook/c4/s4.html - see "Moving Light"
function beginAnalysis(sceneNode) {
    this._allLightNodes = [];
    this._allProgramData = {};
    analyze(sceneNode, this._allLightNodes, this._allProgramData);
}

function analyze(sceneNode, lightNodes, allProgramData) {
    if (sceneNode.nodeType === "LIGHT") {
        lightNodes.push(sceneNode);
    }
    if (sceneNode.nodeType === "GEOMETRY") {
        allProgramData[sceneNode.material.programData.id] = sceneNode.material.programData;
    }
    for (let child of sceneNode.children) {
        analyze(child, lightNodes, allProgramData);
    }
}
