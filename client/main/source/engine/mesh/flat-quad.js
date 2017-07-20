import Mesh, {interleave} from './mesh'
import {gl} from '../gl'

export default class FlatQuad extends Mesh {
    constructor(size=5.0) {
        const positions = [
            -size,  size, 0.0,
            -size, -size, 0.0,
             size, -size, 0.0,
             size,  size, 0.0,
        ];
        const normals = [
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
        ];
        const texcoords = [
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
        ];

        super({
            drawMode: gl.TRIANGLE_FAN,
            vertexData: interleave(positions, normals, texcoords),
            numVertices: positions.length
        });
    }
}
