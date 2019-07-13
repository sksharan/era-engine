import {sceneNodesEndpoint, getSceneNodeEndpoint, refNodePrefix} from '../../../config';
import {RenderNodeType} from '../../../engine/index';
import {ReferenceNodeCache, convertSceneNodesToRenderNodes} from '../../../common/index';

export const FETCH_NODES_REQUEST = 'FETCH_NODES_REQUEST';
export const FETCH_NODES_SUCCESS = 'FETCH_NODES_SUCCESS';
export const FETCH_NODES_FAILURE = 'FETCH_NODES_FAILURE';

const pathRegex = `^${refNodePrefix}`;

export const fetchSceneNodes = () => {
    return dispatch => {
        dispatch({type: FETCH_NODES_REQUEST});
        fetch(`${sceneNodesEndpoint}?pathRegex=${encodeURIComponent(pathRegex)}`)
            .then(response => {
                return Promise.all([response.ok, response.json()]);
            })
            .then(([ok, json]) => {
                if (ok) {
                    return populateRefCache(json).then(() => json);
                } else {
                    dispatch({type: FETCH_NODES_FAILURE, payload: json});
                }
            })
            .then(json => {
                dispatch({type: FETCH_NODES_SUCCESS, payload: json});
            })
            .catch(error => {
                dispatch({type: FETCH_NODES_FAILURE, payload: error});
            });
    };
};

function populateRefCache(sceneNodes) {
    let promises = [],
        sceneNodeIds = [];
    for (let sceneNode of sceneNodes) {
        if (sceneNode.type !== RenderNodeType.REFERENCE) {
            continue;
        }
        if (sceneNodeIds.indexOf(sceneNode.content.sceneNodeId) === -1) {
            sceneNodeIds.push(sceneNode.content.sceneNodeId);
            promises.push(fetchReferencedNode(sceneNode.content.sceneNodeId));
        }
    }
    return Promise.all(promises); // We want to fetch all referenced nodes and their children
}

function fetchReferencedNode(sceneNodeRefId) {
    return fetch(getSceneNodeEndpoint(sceneNodeRefId))
        .then(response => Promise.all([response.ok, response.json()]))
        .then(([ok, json]) => {
            if (!ok) {
                throw new Error(JSON.stringify(json)); // JSON is an error
            }
            return json; // JSON is a single scene node
        })
        .then(referencedNode => {
            return fetchReferencedNodeAndChildren(sceneNodeRefId, referencedNode);
        })
        .catch(error => {
            console.warn(error);
        });
}

function fetchReferencedNodeAndChildren(sceneNodeRefId, referencedNode) {
    return fetch(`${sceneNodesEndpoint}?pathRegex=${encodeURIComponent(referencedNode.path)}`)
        .then(response => Promise.all([response.ok, response.json()]))
        .then(([ok, json]) => {
            if (!ok) {
                throw new Error(JSON.stringify(json)); // JSON is an error
            }
            ReferenceNodeCache.updateReference({
                referenceId: sceneNodeRefId,
                sceneNodes: json,
                renderNodes: convertSceneNodesToRenderNodes(json)
            });
        })
        .catch(error => {
            console.warn(error);
        });
}
