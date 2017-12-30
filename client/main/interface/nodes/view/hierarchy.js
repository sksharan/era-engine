/** Returns an object of the form:
 *  {
 *      'a': {
 *          hierarchy: {
 *              'b': {
 *                  hierarchy: {
 *                      ...
 *                  },
 *                  sceneNodes: [...],
 *                  renderNodes [...],
 *              },
 *              ...
 *          },
 *          sceneNodes: [...],
 *          renderNodes: [...],
 *      },
 *      ...
 *  }
 */
export const createHierarchyFromNodes = ({sceneNodes, renderNodes}) => {
    if (sceneNodes.length !== renderNodes.length) {
        throw new Error(`Node length mismatch: ${sceneNodes.length} scene nodes
            and ${renderNodes.length} render nodes`);
    }
    const hierarchy = {};
    for (let i = 0; i < sceneNodes.length; i++) {
        addNodeToHierarchy(sceneNodes[i], renderNodes[i], hierarchy, "/");
    }
    return hierarchy;
}

function addNodeToHierarchy(sceneNode, renderNode, hierarchy, separator) {
    const pathFragments = sceneNode.path.split(separator);
    let currHierarchy = hierarchy;

    for (let i = 0; i < pathFragments.length; i++) {
        let pathFragment = pathFragments[i];
        if (!currHierarchy[pathFragment]) {
            currHierarchy[pathFragment] = {hierarchy: {}, sceneNodes: [], renderNodes: []};
        }
        if (i === pathFragments.length - 1) {
            currHierarchy[pathFragment].sceneNodes.push(sceneNode);
            currHierarchy[pathFragment].renderNodes.push(renderNode);
        }
        currHierarchy = currHierarchy[pathFragment].hierarchy;
    }
}
