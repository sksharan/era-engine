/** Returns an object of the form:
 *  {
 *      'a': {
 *          hierarchy: {
 *              'b': {
 *                  hierarchy: {
 *                      ...
 *                  },
 *                  sceneNodes: [...]
 *              },
 *              ...
 *          },
 *          sceneNodes: [...]
 *      },
 *      ...
 *  }
 */
export const createHierarchyFromNodes = (sceneNodes) => {
    const hierarchy = {};
    for (let sceneNode of sceneNodes) {
        addNodeToHierarchy(sceneNode, hierarchy, "/");
    }
    return hierarchy;
}

function addNodeToHierarchy(sceneNode, hierarchy, separator) {
    const pathFragments = sceneNode.path.split(separator);
    let currHierarchy = hierarchy;

    for (let i = 0; i < pathFragments.length; i++) {
        let pathFragment = pathFragments[i];
        if (!currHierarchy[pathFragment]) {
            currHierarchy[pathFragment] = {hierarchy: {}, sceneNodes: []}
        }
        if (i === pathFragments.length - 1) {
            currHierarchy[pathFragment].sceneNodes.push(sceneNode);
        }
        currHierarchy = currHierarchy[pathFragment].hierarchy;
    }
}
