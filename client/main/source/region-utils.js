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
          indices: <array of short>
      }

      The 'hexRadius' is the distance from the center of a tile
      to any one of its 6 corners. The distance is defined in terms
      of world space, and a larger 'hexRadius' will result in
      larger tiles to render.

      The 'vertices' contain the world coordinates for all the tiles to
      be rendered. Each vertex is represented a triplet of adjacent floats,
      so if vertices=[1.0, 1.0, 0.0, 2.0, 2.0, 5.0], we have data for two vertices
      (1.0, 1.0, 0.0) and (2.0, 2.0, 5.0).

      The 'indices' are indices into 'vertices', specifically the x-component
      for each vertex. If we have an index *n*, then *n* refers to the
      x-component of the n-th vertex in 'vertices'. Using the 'vertices'
      from the example above, if indices=[0, 1, 0], it refers to the
      vertices (1.0, 1.0, 0.0), (2.0, 2.0, 5.0), and (1.0, 1.0, 0.0).
    */
    getVertices: function(tiles, hexRadius) {
        /* To do the calculation for the tile, note that we can circumscribe a hexagon
           in the unit circle by marking points on the circle at 0, pi/3, 2*pi/3, pi, 4*pi/3,
           and 5*pi/3 radians, then connecting the dots in clockwise or counter-clockwise order.

           If the center of the unit circle has the coordinate (x, z), then we can
           use the following formulas to compute the coordinates at the points on the
           circle mentioned above:
               At 0     : (x + hexRadius,         z)
               At pi/3  : (x + (hexRadius * 0.5), z - (hexRadius * 0.866))
               At 2*pi/3: (x - (hexRadius * 0.5), z - (hexRadius * 0.866))
               At pi    : (x - hexRadius,         z)
               At 4*pi/3: (x - (hexRadius * 0.5), z + (hexRadius * 0.866))
               At 5*pi/3: (x + (hexRadius * 0.5), z + (hexRadius * 0.866))

           These use formulas use the fact that sin(60-degrees) = 0.866 and cos(60-degrees) = 0.5.
           An alternative way to find the coordinates is to start at 0 radians, then multiply the
           coordinate at 0 radians with a rotation matrix that goes 60-degrees clockwise to get the
           coordinate at 5*pi/3 radians. Repeating this process will give the points for the other
           corners of the tile - this is the approach used by this method.

           Then to derive the initial (x, z) coordinates we'll need for the calculations, we use the formulas
               x := tile.loc.x * (hexRadius * 1.5)
               z := [
                      tile.loc.z * (hexRadius * 0.866 * 2), if tile.loc.x is even
                      tile.loc.z * (hexRadius * 0.866 * 3), if tile.loc.x is odd
                    ]
            The offset on z is because the hexagons along the x-axis make a "zig-zag" formation;
            this can be seen in the hexagon grid picture in the method description.
        */

        let vertices = [];
        let indices = [];

        for (let i = 0; i < tiles.length; i++) {
            let tile = tiles[i];

            // Add center vertex for this tile
            let center = vec3.fromValues(
                    tile.loc.x * (hexRadius * 1.5),
                    0,
                    tile.loc.z * (hexRadius * 0.866 * 2));

            if (tile.loc.x % 2 == 1) {
                center[2] += (hexRadius * 0.866);
            }

            vertices.push(center[0]);
            vertices.push(center[1]);
            vertices.push(center[2]);

            // Add the 6 corner vertices for this tile
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
