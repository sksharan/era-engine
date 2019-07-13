/** Returns an object of the form:
 *  {
 *      'a': {
 *          hierarchy: {
 *              'b': {
 *                  hierarchy: {
 *                      ...
 *                  },
 *                  sceneNode: {...},
 *                  renderNode: {...},
 *              },
 *              ...
 *          },
 *          sceneNode: {...},
 *          renderNode: {...},
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
        addNodeToHierarchy(sceneNodes[i], renderNodes[i], hierarchy, '/');
    }
    return hierarchy;
};

function addNodeToHierarchy(sceneNode, renderNode, hierarchy, separator) {
    const pathFragments = sceneNode.path.split(separator);
    let currHierarchy = hierarchy;

    for (let i = 0; i < pathFragments.length; i++) {
        let pathFragment = pathFragments[i];
        if (!currHierarchy[pathFragment]) {
            currHierarchy[pathFragment] = {hierarchy: {}, sceneNode: null, renderNode: null};
        }
        if (i === pathFragments.length - 1) {
            currHierarchy[pathFragment].sceneNode = sceneNode;
            currHierarchy[pathFragment].renderNode = renderNode;
        }
        currHierarchy = currHierarchy[pathFragment].hierarchy;
    }
}
