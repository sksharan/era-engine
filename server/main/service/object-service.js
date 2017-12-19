import * as AdmZip from 'adm-zip'
import * as streamifier from 'streamifier'
import * as path from 'path'
import {uploadFile} from './file-service'
import {saveSceneNode} from './scene-node-service'

export const createFromZip = async (zipFile, objectNodePrefix) => {
    const zip = new AdmZip(zipFile);
    const zipEntries = zip.getEntries();

    let assimpJson = null;
    let textures = {};

    for (let zipEntry of zipEntries) {
        const name = zipEntry.entryName;
        const bufferStream = streamifier.createReadStream(zip.readFile(zipEntry));
        const savedFile = await uploadFile(bufferStream, name);

        if (path.extname(name) === '.json') {
            if (assimpJson !== null) {
                throw new Error("Detected more than one json file in zip package");
            }
            assimpJson = JSON.parse(zip.readAsText(zipEntry));
        } else {
            // Treat all other files as textures
            textures[name] = savedFile._id;
        }
    }

    const sceneNodes = [];
    parseSceneNodes(assimpJson.rootnode, `${objectNodePrefix}${assimpJson.rootnode.name}`,
            sceneNodes, textures, assimpJson);
    for (let sceneNode of sceneNodes) {
        saveSceneNode(sceneNode);
    }
}

function parseSceneNodes(assimpNode, path, sceneNodes, textures, assimpJson) {
    const sceneNode = {
        path: path,
        name: assimpNode.name,
        localMatrix: assimpNode.transformation,
        type: assimpNode.meshes ? 'OBJECT' : 'DEFAULT',
        content: {}
    };

    if (assimpNode.meshes) {
        for (let meshIndex of assimpNode.meshes) {
            const mesh = assimpJson.meshes[meshIndex];
            const material = assimpJson.materials[mesh.materialindex];
            const content = {
                positions: mesh.vertices,
                normals: mesh.normals,
                texcoords: mesh.texturecoords[0],
                indices: getIndices(mesh),
                ambient: toRGB(getProperty(material, '$clr.ambient')),
                diffuse: toRGB(getProperty(material, '$clr.diffuse')),
                specular: toRGB(getProperty(material, '$clr.specular')),
                shininess: getProperty(material, '$mat.shininess').value,
                textureFileId: textures[toFilename(getProperty(material, '$tex.file'))]
            };
            const copy = Object.assign({}, sceneNode);
            copy.content = content;
            sceneNodes.push(copy);
        }
    } else {
        sceneNodes.push(sceneNode);
    }

    if (assimpNode.children) {
        for (let child of assimpNode.children) {
            parseSceneNodes(child, `${path}/${child.name}`, sceneNodes, textures, assimpJson);
        }
    }
}

function getIndices(mesh) {
    const indices = [];
    for (let face of mesh.faces) {
        indices.push(face[0], face[1], face[2]);
    }
    return indices;
}

function getProperty(material, key) {
    for (let property of material.properties) {
        if (property.key === key) {
            return property;
        }
    }
    console.warn("No property found with key " + key);
    return null;
}

function toRGB(property) {
    return { r: property.value[0], g: property.value[1], b: property.value[2] };
}

function toFilename(property) {
    if (property.value.startsWith('.\\')) {
        return property.value.substring(2); // Exclude leading '.\'
    }
    return property.value;
}
