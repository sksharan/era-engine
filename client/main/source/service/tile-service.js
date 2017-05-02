'use strict';

/* A 'tile' is a 3D hexagon that can be placed onto a hexagonal
   grid with other tiles to form a 'region'. */

const Mesh = require('../render/mesh')
const glMatrix = require('gl-matrix').glMatrix;
const vec3 = require('gl-matrix').vec3;
const mat4 = require('gl-matrix').mat4;

module.exports = {
    /* Given a 'tile' object of the form
           { loc: { x: <float>, y: <float>, z: <float> } }
       and a number 'hexRadius' that specifies the radius of
       the tile, returns an object of the form
           { mesh: <Mesh>, transform: <glMatrix-mat4> }

       The 'tile' loc values are not world coordinates but are
       rather values that specify where the tile is in relation
       to other tiles on a hexagonal grid. The 'hexRadius', however,
       does specify a distance in terms of world space.
    */
    getRenderData: function(tile, hexRadius) {
        let vertices = [];
        let normals = [];
        let indices = [];

        /* Start with the top of the tile. Using 7 vertices (a 'center'
           vertex plus 6 'corner' vertices) we can create the 6 triangles
           needed to represent the top of the tile.
        */

        // Add center vertex
        let center = vec3.fromValues(0, 0, 0);
        vertices.push(center[0]); vertices.push(center[1]); vertices.push(center[2]);
        normals.push(0); normals.push(1); normals.push(0); // Normal faces upward

        // Add the 6 corner vertices
        let corner = vec3.fromValues(hexRadius, 0, 0);
        for (let j = 0; j < 6; j++) {
            vertices.push(corner[0]); vertices.push(corner[1]); vertices.push(corner[2]);
            normals.push(0); normals.push(1); normals.push(0); // Normal faces upward
            corner = vec3.rotateY(vec3.create(), corner, center, glMatrix.toRadian(60.0));
        }

        // Add indices
        indices.push(0); indices.push(1); indices.push(2);
        indices.push(0); indices.push(2); indices.push(3);
        indices.push(0); indices.push(3); indices.push(4);
        indices.push(0); indices.push(4); indices.push(5);
        indices.push(0); indices.push(5); indices.push(6);
        indices.push(0); indices.push(6); indices.push(1);

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
            vertices.push(baseCorner[0]); vertices.push(baseCorner[1]); vertices.push(baseCorner[2]);
            // Add the vertex below the corner vertex
            vertices.push(baseCorner[0]); vertices.push(-tile.loc.y); vertices.push(baseCorner[2]);

            baseCorner = vec3.rotateY(vec3.create(), baseCorner, center, glMatrix.toRadian(-60.0));

            // Add the new corner vertex
            vertices.push(baseCorner[0]); vertices.push(baseCorner[1]); vertices.push(baseCorner[2]);
            // Add the vertex below the new corner vertex
            vertices.push(baseCorner[0]); vertices.push(-tile.loc.y); vertices.push(baseCorner[2]);

            // Add the normals for this side of the base - they all face the same direction
            for (let k = 0; k < 4; k++) {
                normals.push(baseNormal[0]); normals.push(baseNormal[1]); normals.push(baseNormal[2]);
            }
            baseNormal = vec3.rotateY(vec3.create(), baseNormal, vec3.fromValues(0, 1, 0), glMatrix.toRadian(-60.0));
            baseNormal = vec3.normalize(vec3.create(), baseNormal);
        }

        // Add indices for the first side of base
        indices.push(7); indices.push(9); indices.push(8);
        indices.push(9); indices.push(10); indices.push(8);

        // Add indices for the second side of base
        indices.push(11); indices.push(13); indices.push(12);
        indices.push(13); indices.push(14); indices.push(12);

        // Add indices for the third side of base
        indices.push(15); indices.push(17); indices.push(16);
        indices.push(17); indices.push(18); indices.push(16);

        // Add indices for the fourth side of base
        indices.push(19); indices.push(21); indices.push(20);
        indices.push(21); indices.push(22); indices.push(20);

        // Add indices for the fifth side of base
        indices.push(23); indices.push(25); indices.push(24);
        indices.push(25); indices.push(26); indices.push(24);

        // Add indices for the sixth side of base
        indices.push(27); indices.push(29); indices.push(28);
        indices.push(29); indices.push(30); indices.push(28);

        /* Finally, calculate the transformation for this tile. The transformation is defined
           by the loc values in 'tile' as well as the 'hexRadius'.
        */

        // These calculations can be derived from the unit circle
        // Note sin(60-degrees) = 0.866, cos(60-degrees) = 0.5
        let transform = vec3.fromValues(
                tile.loc.x * (hexRadius * 1.5),
                tile.loc.y, // This will also shift the bottom of the base to y = 0
                tile.loc.z * (hexRadius * 0.866 * 2));

        // Apply an offset to the z-value so that adjacent tiles on the x-axis will
        // appear in a 'zig-zag' formation
        if (tile.loc.x % 2 == 1) {
            transform[2] += (hexRadius * 0.866);
        }

        return {
            mesh: new Mesh(vertices, 3, normals, 3, indices),
            transform: mat4.fromTranslation(mat4.create(), transform)
        }
    }
}
