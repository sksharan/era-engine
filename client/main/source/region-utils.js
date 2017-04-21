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
       in 'vertices' in (x, y, z) order.

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
        // Understanding the unit circle helps with understanding the math below,
        // see https://www.mathsisfun.com/geometry/unit-circle.html for an interactive unit circle.
        // Specifically, the corners of the hexagon are at 0, pi/3, 2*pi/3, pi, 4*pi/3, and 5*pi/3
        // on the unit circle.

        let vertices = [];
        let indices = [];

        for (let i = 0; i < tiles.length; i++) {
            let tile = tiles[i];

            // Calculate center point for this tile
            let center = vec3.fromValues(
                    tile.loc.x * (hexRadius * 1.5), // Using the fact cos(60-degrees) = 0.5
                    0,
                    tile.loc.y * (hexRadius * 0.866 * 2)); // Using the fact sin(60-degrees) = 0.866

            // Offset every other hexagon along the x-axis by modifying the z-component (see diagram above)
            if (tile.loc.x % 2 == 1) {
                center[2] += (hexRadius * 0.866); // Again using the fact sin(60-degrees) = 0.866
            }

            vertices.push(center[0]);
            vertices.push(center[1]);
            vertices.push(center[2]);

            // Start at rightmost corner and do 60-degree rotations clockwise to get coords for the other 5 corners
            // On the unit circle, this means we'll go in the order 0, 5*pi/3, 4*pi/3, pi, 2*pi/3, pi/3.
            let corner = vec3.fromValues(center[0] + hexRadius, center[1], center[2]);
            for (let j = 0; j < 6; j++) {
                vertices.push(corner[0]);
                vertices.push(corner[1]);
                vertices.push(corner[2]);
                corner = vec3.rotateY(vec3.create(), corner, center, glMatrix.toRadian(-60.0));
            }

            // Add indices for this tile
            indices.push(7 * i); indices.push(7 * i + 1); indices.push(7 * i + 2);
            indices.push(7 * i); indices.push(7 * i + 2); indices.push(7 * i + 3);
            indices.push(7 * i); indices.push(7 * i + 3); indices.push(7 * i + 4);
            indices.push(7 * i); indices.push(7 * i + 4); indices.push(7 * i + 5);
            indices.push(7 * i); indices.push(7 * i + 5); indices.push(7 * i + 6);
            indices.push(7 * i); indices.push(7 * i + 6); indices.push(7 * i + 1);
        }

        return {
            vertices: vertices,
            indices: indices
        }
    }
};
