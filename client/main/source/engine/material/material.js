import {gl} from '../gl'
import {ProgramBuilder} from '../shader/index'
import {vec4} from 'gl-matrix'

const defaultProgramData = new ProgramBuilder().addPosition().build();

export default class Material {
    constructor({
        programData=defaultProgramData,
        imageSrc='public/textures/debug.png',
        color=vec4.fromValues(0, 0, 0, 0),
        isVisible=true,
        ignoreDepth=false
    } = {}) {
        this._programData = programData;
        this._texture = loadTextureAsync(imageSrc);
        this._color = color;
        this._isVisible = isVisible;
        this._ignoreDepth = ignoreDepth;
    }

    get programData() {
        return this._programData;
    }

    get texture() {
        return this._texture;
    }

    get color() {
        return this._color;
    }
    set color(color) {
        this._color = color;
    }

    get isVisible() {
        return this._isVisible;
    }

    get ignoreDepth() {
        return this._ignoreDepth;
    }
}

/* Creates a texture using the given image source. Returns the handle to the
   texture immediately, but loads the image data asynchronously. */
export function loadTextureAsync(imageSrc) {
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Start with a default texture color until the image is loaded
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([127, 127, 127, 255]));

    let image = new Image();
    image.src = imageSrc;
    image.crossOrigin = 'anonymous';
    image.addEventListener('load' , () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
    });

    return texture;
}
