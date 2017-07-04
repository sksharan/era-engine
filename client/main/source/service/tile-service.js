/* A 'tile' is a 3D hexagon that can be placed onto a hexagonal
   grid with other tiles to form a 'region'. */

import Mesh from '../engine/render/mesh/mesh'
import {glMatrix, mat4, vec3} from 'gl-matrix'

export default {
    /* Given a 'tile' object of the form
           { loc: { x: <float>, y: <float>, z: <float> } }
       and a number 'hexRadius' that specifies the radius of
       the tile, returns an object of the form
           { mesh: <Mesh>, localMatrix: <glMatrix-mat4> }

       The 'tile' loc values are not world coordinates but are
       rather values that specify where the tile is in relation
       to other tiles on a hexagonal grid. The 'hexRadius', however,
       does specify a distance in terms of world space.
    */
    getRenderData: function(tile, hexRadius) {
        let vertices = [];
        let normals = [];
        let texcoords = [];
        let indices = [];

        /* Start with the top of the tile. Using 7 vertices (a 'center'
           vertex plus 6 'corner' vertices) we can create the 6 triangles
           needed to represent the top of the tile.
        */

        // Add center vertex
        let center = vec3.fromValues(0, 0, 0);
        vertices.push(center[0], center[1], center[2]);
        normals.push(0, 1, 0); // Normal faces upward

        // Add the 6 corner vertices
        let corner = vec3.fromValues(hexRadius, 0, 0);
        for (let j = 0; j < 6; j++) {
            vertices.push(corner[0], corner[1], corner[2]);
            normals.push(0, 1, 0); // Normal faces upward
            corner = vec3.rotateY(vec3.create(), corner, center, glMatrix.toRadian(60.0));
        }

        // Add texcoords
        texcoords.push(0.5, 0.5); // Middle of image for center of tile
        texcoords.push(1.0, 0.5);
        texcoords.push(0.75, 1.0);
        texcoords.push(0.25, 1.0);
        texcoords.push(0, 0.5);
        texcoords.push(0.25, 0);
        texcoords.push(0.75, 0);

        // Add indices
        indices.push(0, 1, 2);
        indices.push(0, 2, 3);
        indices.push(0, 3, 4);
        indices.push(0, 4, 5);
        indices.push(0, 5, 6);
        indices.push(0, 6, 1);

        /* Now we create the base of the tile to make the tile 3-dimensional.
           Each side of the base is made up of 4 vertices: two adjacent 'corner'
           vertices from the top of the tile, and two vertices directly below
           the 'corner' vertices. The base is made up of 6 sides total. We can't reuse
           any of the vertices created above because the normals are different.
        */

        let baseCorner = vec3.fromValues(hexRadius, 0, 0); // Start at same corner as before
        let baseNormal = vec3.fromValues(0.866, 0, 0.5);  // Starting with the base that faces +x/+z direction
        for (let j = 0; j < 6; j++) {
            // Add the corner vertex
            vertices.push(baseCorner[0], baseCorner[1], baseCorner[2]);
            // Add the vertex below the corner vertex
            vertices.push(baseCorner[0], -tile.loc.y, baseCorner[2]);

            baseCorner = vec3.rotateY(vec3.create(), baseCorner, center, glMatrix.toRadian(-60.0));

            // Add the new corner vertex
            vertices.push(baseCorner[0], baseCorner[1], baseCorner[2]);
            // Add the vertex below the new corner vertex
            vertices.push(baseCorner[0], -tile.loc.y, baseCorner[2]);

            // Add the normals for this side of the base - they all face the same direction
            for (let k = 0; k < 4; k++) {
                normals.push(baseNormal[0], baseNormal[1], baseNormal[2]);
            }
            baseNormal = vec3.rotateY(vec3.create(), baseNormal, vec3.fromValues(0, 1, 0), glMatrix.toRadian(-60.0));
            baseNormal = vec3.normalize(vec3.create(), baseNormal);

            // Add texcoords for the base, same for each iteration of the loop
            texcoords.push(0.75, 1.0);
            texcoords.push(0.75, 0.0);
            texcoords.push(0.25, 1.0);
            texcoords.push(0.25, 0.0);
        }

        // Add indices for the first side of base
        indices.push(7, 9, 8);
        indices.push(9, 10, 8);

        // Add indices for the second side of base
        indices.push(11, 13, 12);
        indices.push(13, 14, 12);

        // Add indices for the third side of base
        indices.push(15, 17, 16);
        indices.push(17, 18, 16);

        // Add indices for the fourth side of base
        indices.push(19, 21, 20);
        indices.push(21, 22, 20);

        // Add indices for the fifth side of base
        indices.push(23, 25, 24);
        indices.push(25, 26, 24);

        // Add indices for the sixth side of base
        indices.push(27, 29, 28);
        indices.push(29, 30, 28);

        /* Calculate the transformation for this tile. The transformation is defined
           by the loc values in 'tile' as well as the 'hexRadius'.
        */

        // These calculations can be derived from the unit circle
        // Note sin(60-degrees) = 0.866, cos(60-degrees) = 0.5
        let localMatrix = vec3.fromValues(
                tile.loc.x * (hexRadius * 1.5),
                tile.loc.y, // This will also shift the bottom of the base to y = 0
                tile.loc.z * (hexRadius * 0.866 * 2));

        // Apply an offset to the z-value so that adjacent tiles on the x-axis will
        // appear in a 'zig-zag' formation
        if (tile.loc.x % 2 == 1) {
            localMatrix[2] += (hexRadius * 0.866);
        }

        return {
            mesh: new Mesh({
                vertices,
                floatsPerVertex: 3,
                normals,
                floatsPerNormal: 3,
                texcoords,
                floatsPerTexcoord: 2,
                indices
            }),
            localMatrix: mat4.fromTranslation(mat4.create(), localMatrix)
        }
    }
}
