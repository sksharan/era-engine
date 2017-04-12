const glMatrix = require('gl-matrix').glMatrix;
const vec3 = require('gl-matrix').vec3;

module.exports = {
    /* Given an array of tiles, where each tile is of the form
       {
           loc: {
               x: <x offset coordinate>
               y: <y offset coordinate>
           },
           // Some other properties - only 'loc' is important
       }
       and a 'hexRadius' that defines the distance from the center
       of a hexagonal tile to any one of its 6 corners, returns
       an object of the form
       {
           vertices: <array of floats>,
           indices: <array of ints>
       }
       where 'vertices' are in world coordinates and 'indices' are
       indices into 'vertices'. There are 3 floats per vertex, and
       the floats that make up a vertex are adjacent to each other
       in 'vertices' in (x, y, z) order. The values in 'indices'
       point to the first (x) component for each vertex.

       The offset (x, y) coordinates can be pictured as follows:
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
                    y-axis

       Each hexagon is made of 6 triangles, so each hexagon has
       6*3 = 18 indices associated with it.
    */
    getVertices: function(tiles, hexRadius) {
        let vertices = [];
        let indices = [];

        // TODO: optimize by not adding duplicate vertices to 'vertices'
        for (let i = 0; i < tiles.length; i++) {
            let tile = tiles[i];

            // Calculate center point for this tile
            let center = vec3.fromValues(
                    tile.loc.x * (hexRadius * 2),
                    0,
                    tile.loc.y * (hexRadius * 2));

            if (tile.loc.x % 2 == 1) {
                center[2] += hexRadius;
            }
            vertices.push(center[0]);
            vertices.push(center[1]);
            vertices.push(center[2]);

            // Start at rightmost corner and do 60-degree rotations to get coords for the other 5 corners
            let corner = vec3.fromValues(center[0] + hexRadius, center[1], center[2]);
            for (let j = 0; j < 6; j++) {
                vertices.push(corner[0]);
                vertices.push(corner[1]);
                vertices.push(corner[2]);
                corner = vec3.rotateY(vec3.create(), corner, center, glMatrix.toRadian(-60.0));
            }

            // Add indices for this tile
            indices.push(21 * i); indices.push(21 * i + 3); indices.push(21 * i + 6);
            indices.push(21 * i); indices.push(21 * i + 6); indices.push(21 * i + 9);
            indices.push(21 * i); indices.push(21 * i + 9); indices.push(21 * i + 12);
            indices.push(21 * i); indices.push(21 * i + 12); indices.push(21 * i + 15);
            indices.push(21 * i); indices.push(21 * i + 15); indices.push(21 * i + 18);
            indices.push(21 * i); indices.push(21 * i + 18); indices.push(21 * i + 3);
        }

        return {
            vertices: vertices,
            indices: indices
        }
    }
};
