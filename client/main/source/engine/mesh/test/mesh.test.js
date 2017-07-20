import {assert} from 'chai'
import MeshInjector from 'inject-loader!../mesh'

// Setup WebGL
document.body.insertAdjacentHTML('beforeend',
        '<canvas id="canvas" height="720" width="1080"></canvas>');
const gl = document.getElementById('canvas').getContext('webgl');

const Mesh = MeshInjector({
    '../gl': {
        gl: gl
    }
});

describe('interleave function', () => {
    it('should interleave position, normal, and texcoord data', () => {
        const positions = [0, 1, 2, 8, 9, 10];
        const normals = [3, 4, 5, 11, 12, 13];
        const texcoords = [6, 7, 14, 15];

        const interleaved = Mesh.interleave(positions, normals, texcoords);
        // TODO: this is better expressed with assert.sameOrderedMembers - update chai?
        assert.deepEqual(interleaved, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    });
});
