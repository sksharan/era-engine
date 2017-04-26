/* A 'region' consists of a set of hexagonal 'tiles' that can be arranged
in a hexagonal grid pattern. If we look down the -y axis, it would look like:
               ___
              /3,0\
              \___/
   ___     ___/3,1\___     ___
  /0,2\___/2,2\___/4,2\___/6,2\ x-axis
  \___/1,2\___/3,2\___/5,2\___/
      \___/   \___/   \___/
              /3,3\
              \___/
              /3,4\
              \___/
              z-axis

The coordinates in each tile are the (x, z) coordinates. Tiles also have
a 'base' that can be visualized as:
               ___
              /3,0\ <-(tile)
             |\___/|
             |     | <- (tile base)
              \___/

The base is a component that gives the tile a 3D appearance. The base
always starts at ground-level (y = 0), so if a tile has a larger y-component,
it will also have a larger base.
*/

const Mesh = require('./mesh-base')
const glMatrix = require('gl-matrix').glMatrix;
const vec3 = require('gl-matrix').vec3;

module.exports = {
    /* Given an array of 'tiles' and a number 'hexRadius', returns a Mesh
       object that can be used to render the region represented by 'tiles'.
       Each tile in 'tiles' is expected to be an object of the form
       { loc: { x: <float>, y: <float>, z: <float> } }. */
    getMesh: function(tiles, hexRadius) {
        let vertices = [];
        let normals = [];
        let indices = [];

        // Number of indices generated per tile, including the base
        const numIndices = 31;

        for (let i = 0; i < tiles.length; i++) {
            let tile = tiles[i];

            /* First, begin creating the top of the tile. Using 7 vertices (a
               a 'center' vertex plus 6 'corner' vertices) we can create the
               6 triangles necessary to render the top of the tile. */

            // Add center vertex for the tile
            let center = vec3.fromValues(
                    tile.loc.x * (hexRadius * 1.5),
                    tile.loc.y,
                    tile.loc.z * (hexRadius * 0.866 * 2));
            if (tile.loc.x % 2 == 1) {
                center[2] += (hexRadius * 0.866);
            }
            vertices.push(center[0]); vertices.push(center[1]); vertices.push(center[2]);

            // Add normal for center - always facing upward
            normals.push(0); normals.push(1); normals.push(0);

            // Add the 6 corner vertices for the tile
            // We can start at one corner and calculate the coordinates of the other corners by
            // repeatedly doing 60-degree rotations
            let corner = vec3.fromValues(center[0] + hexRadius, center[1], center[2]);
            for (let j = 0; j < 6; j++) {
                vertices.push(corner[0]); vertices.push(corner[1]); vertices.push(corner[2]);

                // Add normal for corner - always facing upward
                normals.push(0); normals.push(1); normals.push(0);

                corner = vec3.rotateY(vec3.create(), corner, center, glMatrix.toRadian(-60.0));
            }

            // Add indices for the tile
            indices.push(numIndices * i); indices.push(numIndices * i + 1); indices.push(numIndices * i + 2);
            indices.push(numIndices * i); indices.push(numIndices * i + 2); indices.push(numIndices * i + 3);
            indices.push(numIndices * i); indices.push(numIndices * i + 3); indices.push(numIndices * i + 4);
            indices.push(numIndices * i); indices.push(numIndices * i + 4); indices.push(numIndices * i + 5);
            indices.push(numIndices * i); indices.push(numIndices * i + 5); indices.push(numIndices * i + 6);
            indices.push(numIndices * i); indices.push(numIndices * i + 6); indices.push(numIndices * i + 1);

            /* Now we create the base of the tile. Each side of base requires 4 vertices:
               two adjacent 'corner' vertices from the tile, and two vertices that are
               directly below those 'corner' vertices with y-components of 0. The base is
               made up of 6 sides total. We can't reuse any of the vertices created above
               because the normals are different. */

            let base = vec3.fromValues(center[0] + hexRadius, center[1], center[2]);
            let baseNormal = vec3.fromValues(1, 0, 0);  // Starting with the base that faces +x direction
            for (let j = 0; j < 6; j++) {
                // Add the corner vertex and the corresponding vertex below it
                vertices.push(base[0]); vertices.push(base[1]); vertices.push(base[2]);
                normals.push(baseNormal[0]); normals.push(baseNormal[1]); normals.push(baseNormal[2]);

                vertices.push(base[0]); vertices.push(0); vertices.push(base[2]);
                normals.push(baseNormal[0]); normals.push(baseNormal[1]); normals.push(baseNormal[2]);

                // The corner vertex and the vertex below it need to be used twice when creating the base,
                // but with different normals. As a result, we do this rotation and add the next set of
                // vertices early before the next iteration of the loop
                base = vec3.rotateY(vec3.create(), base, center, glMatrix.toRadian(-60.0));
                baseNormal = vec3.rotateY(vec3.create(), baseNormal, vec3.fromValues(0, 1, 0), glMatrix.toRadian(-60.0));
                baseNormal = vec3.normalize(vec3.create(), baseNormal);

                vertices.push(base[0]); vertices.push(base[1]); vertices.push(base[2]);
                normals.push(baseNormal[0]); normals.push(baseNormal[1]); normals.push(baseNormal[2]);

                vertices.push(base[0]); vertices.push(0); vertices.push(base[2]);
                normals.push(baseNormal[0]); normals.push(baseNormal[1]); normals.push(baseNormal[2]);
            }

            // Add indices for the tile base
            indices.push(numIndices * i + 7); indices.push(numIndices * i + 8); indices.push(numIndices * i + 9);
            indices.push(numIndices * i + 9); indices.push(numIndices * i + 8); indices.push(numIndices * i + 10);

            indices.push(numIndices * i + 11); indices.push(numIndices * i + 12); indices.push(numIndices * i + 13);
            indices.push(numIndices * i + 13); indices.push(numIndices * i + 12); indices.push(numIndices * i + 14);

            indices.push(numIndices * i + 15); indices.push(numIndices * i + 16); indices.push(numIndices * i + 17);
            indices.push(numIndices * i + 17); indices.push(numIndices * i + 16); indices.push(numIndices * i + 18);

            indices.push(numIndices * i + 19); indices.push(numIndices * i + 20); indices.push(numIndices * i + 21);
            indices.push(numIndices * i + 21); indices.push(numIndices * i + 20); indices.push(numIndices * i + 22);

            indices.push(numIndices * i + 23); indices.push(numIndices * i + 24); indices.push(numIndices * i + 25);
            indices.push(numIndices * i + 25); indices.push(numIndices * i + 24); indices.push(numIndices * i + 26);

            indices.push(numIndices * i + 27); indices.push(numIndices * i + 28); indices.push(numIndices * i + 29);
            indices.push(numIndices * i + 29); indices.push(numIndices * i + 28); indices.push(numIndices * i + 30);
        }

        return new Mesh(vertices, normals, indices);
    }
};
