import Mesh from './mesh'
import {gl} from '../gl'

export default class FlatQuad extends Mesh {
    constructor(size=5.0) {
        super({
            drawMode: gl.TRIANGLE_FAN,

            vertices: [
                -size,  size, 0.0,
                -size, -size, 0.0,
                 size, -size, 0.0,
                 size,  size, 0.0,
            ],
            floatsPerVertex: 3,

            normals: [
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,
            ],
            floatsPerNormal: 3,

            texcoords: [
                0.0, 1.0,
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0,
            ],
            floatsPerTexcoord:2
        });
    }
}
