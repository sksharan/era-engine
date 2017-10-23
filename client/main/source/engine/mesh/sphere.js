import Mesh from './mesh'
import {gl} from '../gl'

export default class Sphere extends Mesh {
    // Algorithm from https://stackoverflow.com/questions/5988686/creating-a-3d-sphere-in-opengl-using-visual-c/5989676#5989676
    // except we use GL_TRIANGLES instead of GL_QUADS
    constructor(radius, rings, sectors, {customTexcoords=null} = {}) {
        if (!radius || !rings || !sectors) {
            throw new TypeError('Must specify radius, rings, and sectors');
        }
        let positions = [];
        let normals = [];
        let texcoords = [];
        let indices = [];

        const R = 1.0/(rings-1);
        const S = 1.0/(sectors-1);
        for (let r = 0; r < rings; r++) {
            for (let s = 0; s < sectors; s++) {
                const x = Math.cos(2*Math.PI * s * S) * Math.sin(Math.PI * r * R);
                const y = Math.sin(-(Math.PI/2) + Math.PI * r * R);
                const z = Math.sin(2*Math.PI * s * S) * Math.sin(Math.PI * r * R);
                positions.push(x*radius, y*radius, z*radius);
                normals.push(x, y, z);
                if (customTexcoords) {
                    texcoords.push(customTexcoords[0], customTexcoords[1]);
                } else {
                    texcoords.push(s*S, r*R);
                }
            }
        }

        for (let r = 0; r < rings - 1; r++) {
            for (let s = 0; s < sectors - 1; s++) {
                indices.push(r * sectors + (s+1));
                indices.push(r * sectors + s);
                indices.push((r+1) * sectors + (s+1));
                indices.push((r+1) * sectors + s);
                indices.push((r+1) * sectors + (s+1));
                indices.push(r * sectors + s);
            }
        }

        super({
            drawMode: gl.TRIANGLES,
            positions,
            normals,
            texcoords,
            indices,
            numVertices: positions.length
        });
    }
}
