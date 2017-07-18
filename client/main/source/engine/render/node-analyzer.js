/* Provides high-level information about a scene graph.
 * Call analyze(), then call the other methods to get the
 * results of the analysis.
 */
export default class NodeAnalyzer {
    constructor() {
        this._allLightNodes = [];
        this._prevLightNodes = null;
        this._lightsChanged = false;

        this._allProgramData = {};
    }

    // Collect data about the scene graph by traversing every node
    analyze(sceneNode) {
        this._lightsChanged = (this._prevLightNodes === null);
        this._prevLightNodes = this._allLightNodes;

        beginAnalysis.call(this, sceneNode);
    }

    // Get the light scene nodes detected by the analysis
    getAllLightNodes() {
        return this._allLightNodes;
    }

    lightsChanged() {
        return this._lightsChanged;
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
    analyze.call(this, sceneNode);

    if (this._prevLightNodes.length !== this._allLightNodes.length) {
        this._lightsChanged = true;
    }
}

function analyze(sceneNode) {
    if (sceneNode.nodeType === "LIGHT") {
        this._allLightNodes.push(sceneNode);

        if (!this._lightsChanged && this._prevLightNodes.indexOf(sceneNode) === -1) {
            this._lightsChanged = true;
        }
    }

    if (sceneNode.nodeType === "GEOMETRY") {
        this._allProgramData[sceneNode.material.programData.id] = sceneNode.material.programData;
    }

    for (let child of sceneNode.children) {
        analyze.call(this, child);
    }
}
