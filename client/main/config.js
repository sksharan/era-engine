const server = 'http://localhost:3000';

export const filesEndpoint = `${server}/files`;
export const fileMetadataEndpoint = `${server}/files/metadata`;
export const getFileContentEndpoint = (fileId) => {
    return `${server}/files/${fileId}/content`;
}

export const objectsEndpoint = `${server}/objects`;

export const sceneNodesEndpoint = `${server}/scene-nodes`;
export const getSceneNodeEndpoint = (sceneNodeId) => {
    return `${sceneNodesEndpoint}/${sceneNodeId}`;
}

export const refNodePrefix = "__ref_";
