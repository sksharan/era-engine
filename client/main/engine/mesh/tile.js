import Mesh from './mesh';
import {gl} from '../gl';

export default class Tile extends Mesh {
    constructor(radius = 5.0, height = 5.0, includeTop = true, includeSides = true) {
        let positions = [];
        let normals = [];
        let texcoords = [];

        if (includeTop) {
            const top = getTop(radius);
            positions = top.positions;
            normals = top.normals;
            texcoords = top.texcoords;

            if (includeSides) {
                // Add the degenerate triangle
                positions = positions.concat(radius, 0, 0, radius, 0, 0, radius, 0, 0);
                normals = normals.concat(0, 0, 0, 0, 0, 0, 0, 0, 0);
                texcoords = texcoords.concat(0, 0, 0, 0, 0, 0);
            }
        }

        if (includeSides) {
            const sides = getSides(radius, height);
            positions = positions.concat(sides.positions);
            normals = normals.concat(sides.normals);
            texcoords = texcoords.concat(sides.texcoords);
        }

        super({
            drawMode: gl.TRIANGLE_STRIP,
            positions,
            normals,
            texcoords,
            numVertices: positions.length
        });
    }
}

function getTop(radius) {
    return {
        // prettier-ignore
        positions: [
            radius,         0,  0,
            0,              0,  0,
            radius / 2,     0,  radius * 0.866,
            0,              0,  0,
            -(radius / 2),  0,  radius * 0.866,
            0,              0,  0,
            -radius,        0,  0,
            0,              0,  0,
            -(radius / 2),  0,  -(radius * 0.866),
            0,              0,  0,
            radius / 2,     0,  -(radius * 0.866),
            0,              0,  0,
            radius,         0,  0,
        ],
        // prettier-ignore
        normals: [
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
        ],
        // prettier-ignore
        texcoords: [
            1.0,  0.5,
            0.5,  0.5,
            0.75, 1.0,
            0.5,  0.5,
            0.25, 1.0,
            0.5,  0.5,
            0,    0.5,
            0.5,  0.5,
            0.25, 0,
            0.5,  0.5,
            0.75, 0,
            0.5,  0.5,
            1.0,  0.5,
        ]
    };
}

function getSides(radius, height) {
    return {
        // prettier-ignore
        positions: [
             radius,         0,        0,
             radius,         -height,  0,
             radius / 2,     0,        -(radius * 0.866),
             radius / 2,     -height,  -(radius * 0.866),

             radius / 2,     0,        -(radius * 0.866),
             radius / 2,     -height,  -(radius * 0.866),
             -(radius / 2),  0,        -(radius * 0.866),
             -(radius / 2),  -height,  -(radius * 0.866),

             -(radius / 2),  0,        -(radius * 0.866),
             -(radius / 2),  -height,  -(radius * 0.866),
             -radius,        0,        0,
             -radius,        -height,  0,

             -radius,        0,        0,
             -radius,        -height,  0,
             -(radius / 2),  0,        radius * 0.866,
             -(radius / 2),  -height,  radius * 0.866,

             -(radius / 2),  0,        radius * 0.866,
             -(radius / 2),  -height,  radius * 0.866,
             radius / 2,     0,        radius * 0.866,
             radius / 2,     -height,  radius * 0.866,

             radius / 2,     0,        radius * 0.866,
             radius / 2,     -height,  radius * 0.866,
             radius,         0,        0,
             radius,         -height,  0,
        ],
        // prettier-ignore
        normals: [
            0.866, 0, 0.5,
            0.866, 0, 0.5,
            0.866, 0, 0.5,
            0.866, 0, 0.5,

            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,

            -0.866, 0, 0.5,
            -0.866, 0, 0.5,
            -0.866, 0, 0.5,
            -0.866, 0, 0.5,

            -0.866, 0, -0.5,
            -0.866, 0, -0.5,
            -0.866, 0, -0.5,
            -0.866, 0, -0.5,

            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,

            0.866, 0, -0.5,
            0.866, 0, -0.5,
            0.866, 0, -0.5,
            0.866, 0, -0.5,
        ],
        // TODO
        // prettier-ignore
        texcoords: [
            0.0, 0.0,
            0.0, 0.0,
            0.0, 0.0,
            0.0, 0.0,

            0.0, 0.0,
            0.0, 0.0,
            0.0, 0.0,
            0.0, 0.0,

            0.0, 0.0,
            0.0, 0.0,
            0.0, 0.0,
            0.0, 0.0,

            0.0, 0.0,
            0.0, 0.0,
            0.0, 0.0,
            0.0, 0.0,

            0.0, 0.0,
            0.0, 0.0,
            0.0, 0.0,
            0.0, 0.0,

            0.0, 0.0,
            0.0, 0.0,
            0.0, 0.0,
            0.0, 0.0,
        ]
    };
}
