const glMatrix = require('gl-matrix').glMatrix;
const vec3 = require('gl-matrix').vec3;

module.exports = {
    /* Given an array of 'tiles' and a number 'hexRadius', returns an object
       containing the data necessary to render the tiles.
      ---
       A 'region' consists of a set of hexagonal 'tiles' that can be arranged
       in a hexagonal grid pattern:
                      ___
      (more tiles)   /3,0\   (more tiles)
                     \___/
          ___     ___/3,1\___     ___
         /0,2\___/2,2\___/4,2\___/6,2\ x-axis
         \___/1,2\___/3,2\___/5,2\___/
             \___/   \___/   \___/
                     /3,3\
      (more tiles)   \___/   (more tiles)
                     /3,4\
                     \___/
                     z-axis

      The coordinates in each tile are the (x, z) coordinates. The
      y-component (not pictured) is the height; in the picture above
      it would be how much the tile "extends out" from the screen.

      Each tile can be represented as an object of the form:
      {
          loc: {
              x: <float>,
              y: <float>,
              z: <float>
          }
      }
      The 'loc' property defines the position of the tile in a 3D
      hexagonal grid space, similar to the picture above (although the
      picture shows a 2D space). The 'loc' values are not the
      actual world coordinates for the tile. They are used to define
      the position of tiles relative to one another and can be used
      to calculate the actual world coordinates.

      Given an array of 'tiles' and a 'hexRadius', this method will
      return an object of the form:
      {
          vertices: <array of float>,
          normal: <array of float>,
          indices: <array of short>
      }

      The 'hexRadius' is the distance from the center of a tile
      to any one of its 6 corners. The distance is defined in terms
      of world space, and a larger 'hexRadius' will result in
      larger tiles to render.

      The 'vertices' contain the world coordinates for all the tiles to
      be rendered. Each vertex is represented by a triplet of adjacent floats,
      so if vertices=[1.0, 1.0, 0.0, 2.0, 2.0, 5.0], we have data for two vertices
      (1.0, 1.0, 0.0) and (2.0, 2.0, 5.0).

      The 'normals' are the normals for 'vertices', and just like 'vertices',
      each normal is represented as a triple of adjacent floats. The n-th normal
      in 'normal' is the normal for the n-th vertex in 'vertices'.

      The 'indices' are indices into 'vertices', specifically the x-component
      for each vertex. If we have an index *n*, then *n* refers to the
      x-component of the n-th vertex in 'vertices'. Using the 'vertices'
      from the example above, if indices=[0, 1, 0], it refers to the
      vertices (1.0, 1.0, 0.0), (2.0, 2.0, 5.0), and (1.0, 1.0, 0.0).
    */
    getRenderData: function(tiles, hexRadius) {
        /* To create the hexagonal tile, we use 7 vertices: one for the center, and one
           for the each of the 6 corners of the hexagon. We can draw the hexagon using
           6 triangles, each starting from the center vertex and including two of the corner vertices.

           In addition, we need 6 'base' vertices that are directly below the 6 corner
           vertices. The 'base' vertices are on ground-level and can be connected to
           the tile corners. By doing so, a tile that has with a larger y-component will appear
           as a hexagonal tower instead of just floating in the air.
           ---
           To do the calculations for the x and z components of the tile:

           Note that we can circumscribe a hexagon in the unit circle by marking points
           on the circle at 0, pi/3, 2*pi/3, pi, 4*pi/3, and 5*pi/3 radians, then
           connecting the dots in clockwise or counter-clockwise order.

           If the center of the unit circle has the coordinate (x, z), then we can
           use the following formulas to compute the coordinates at the points on the
           circle mentioned above:
               At 0     : (x + hexRadius,         z)
               At pi/3  : (x + (hexRadius * 0.5), z - (hexRadius * 0.866))
               At 2*pi/3: (x - (hexRadius * 0.5), z - (hexRadius * 0.866))
               At pi    : (x - hexRadius,         z)
               At 4*pi/3: (x - (hexRadius * 0.5), z + (hexRadius * 0.866))
               At 5*pi/3: (x + (hexRadius * 0.5), z + (hexRadius * 0.866))

           These formulas use the fact that sin(60-degrees) = 0.866 and cos(60-degrees) = 0.5.
           An alternative way to find the coordinates is to start at 0 radians, then multiply the
           coordinate at 0 radians with a rotation matrix that goes 60-degrees clockwise on the circle
           to get the coordinate at 5*pi/3 radians. Repeating this process will give the points for
           the other corners of the tile - this is the approach used by this method.

           Then to derive the initial (x, z) coordinates we'll need for the calculations, we use the formulas
               x := tile.loc.x * (hexRadius * 1.5)
               z := [
                      tile.loc.z * (hexRadius * 0.866 * 2), if tile.loc.x is even
                      tile.loc.z * (hexRadius * 0.866 * 3), if tile.loc.x is odd
                    ]
            The offset on z is because the hexagons along the x-axis make a "zig-zag" formation;
            this can be seen in the hexagon grid picture above.
        */

        let vertices = [];
        let normals = [];
        let indices = [];
        // Number of indices generated per tile, including the base
        const numIndices = 31;

        for (let i = 0; i < tiles.length; i++) {
            let tile = tiles[i];

            // Add center vertex for this tile
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

            // Add the 6 corner vertices for this tile - working in counter-clockwise order
            let corner = vec3.fromValues(center[0] + hexRadius, center[1], center[2]);
            for (let j = 0; j < 6; j++) {
                vertices.push(corner[0]); vertices.push(corner[1]); vertices.push(corner[2]);

                // Add normal for corner - always facing upward
                normals.push(0); normals.push(1); normals.push(0);

                corner = vec3.rotateY(vec3.create(), corner, center, glMatrix.toRadian(-60.0));
            }

            // Add indices for this tile
            indices.push(numIndices * i); indices.push(numIndices * i + 1); indices.push(numIndices * i + 2);
            indices.push(numIndices * i); indices.push(numIndices * i + 2); indices.push(numIndices * i + 3);
            indices.push(numIndices * i); indices.push(numIndices * i + 3); indices.push(numIndices * i + 4);
            indices.push(numIndices * i); indices.push(numIndices * i + 4); indices.push(numIndices * i + 5);
            indices.push(numIndices * i); indices.push(numIndices * i + 5); indices.push(numIndices * i + 6);
            indices.push(numIndices * i); indices.push(numIndices * i + 6); indices.push(numIndices * i + 1);

            // Add the 'base' vertices for this tile - once again working in counter-clockwise order
            let base = vec3.fromValues(center[0] + hexRadius, center[1], center[2]);
            let baseNormal = vec3.fromValues(1, 0, 0);
            for (let j = 0; j < 6; j++) {
                // Add duplicated corner vertex - we need to reuse it but with a different normal
                vertices.push(base[0]); vertices.push(base[1]); vertices.push(base[2]);
                normals.push(baseNormal[0]); normals.push(baseNormal[1]); normals.push(baseNormal[2]);

                // Add base vertex correspoding the corner vertex - the base has y-component = 0
                vertices.push(base[0]); vertices.push(0); vertices.push(base[2]);
                normals.push(baseNormal[0]); normals.push(baseNormal[1]); normals.push(baseNormal[2]);

                base = vec3.rotateY(vec3.create(), base, center, glMatrix.toRadian(-60.0));
                baseNormal = vec3.rotateY(vec3.create(), baseNormal, vec3.fromValues(0, 1, 0), glMatrix.toRadian(-60.0));
                baseNormal = vec3.normalize(vec3.create(), baseNormal);

                // Add base and corner vertices again, but now with updated normals
                vertices.push(base[0]); vertices.push(base[1]); vertices.push(base[2]);
                normals.push(baseNormal[0]); normals.push(baseNormal[1]); normals.push(baseNormal[2]);
                vertices.push(base[0]); vertices.push(0); vertices.push(base[2]);
                normals.push(baseNormal[0]); normals.push(baseNormal[1]); normals.push(baseNormal[2]);
            }

            // Add indices for the 'base' of the tile
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

        return {
            vertices: vertices,
            normals: normals,
            indices: indices
        }
    }
};
