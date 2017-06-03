import {getRGBAObject} from '../color-converter'
import {vec4} from 'gl-matrix'
import {assert} from 'chai'

describe('Color converter', () => {

    it('should correctly convert a vec4 to an RGBA object', () => {
        const rgba = getRGBAObject(vec4.fromValues(0, 0.5, 1, 1));
        assert.equal(rgba.r, 0);
        assert.equal(rgba.g, 128); // Rounded from 127.5
        assert.equal(rgba.b, 255);
        assert.equal(rgba.a, 1);
    });

});
