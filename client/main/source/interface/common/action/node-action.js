// FIXME: these types currently need to be in a separate file otherwise
// canvas will not appear correctly
import {
    FETCH_NODES_REQUEST,
    FETCH_NODES_SUCCESS,
    FETCH_NODES_FAILURE
} from './node-action-type'

import {sceneNodesEndpoint, getSceneNodeEndpoint, refNodePrefix} from '../../../config'
import {
    // convertToRenderRefNode,
    SceneNodeType,
    // ReferenceNodeEngineCache,
    ReferenceNodeExternalCache,
} from '../../engineop/index'

const pathRegex = `^${refNodePrefix}`

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
    }
}

function populateRefCache(sceneNodes) {
    let promises = [], sceneNodeIds = [];
    for (let sceneNode of sceneNodes) {
        if (sceneNode.type !== SceneNodeType.REFERENCE) {
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
            // FIXME: Are render nodes needed here?
            // const renderNodes = [];
            // for (let sceneNode of json) {
            //     renderNodes.push(convertToRenderRefNode(sceneNode));
            // }
            // ReferenceNodeEngineCache.updateReference({
            //     referenceId: sceneNodeRefId,
            //     data: renderNodes
            // });
            ReferenceNodeExternalCache.updateReference({
                referenceId: sceneNodeRefId,
                data: json
            });
        })
        .catch(error => {
            console.warn(error);
        });
}
