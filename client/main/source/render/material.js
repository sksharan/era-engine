/* Material that can associated with a mesh that determines
   the renderable properties of that mesh. */

import {loadTextureAsync} from '../gl-utils'

export default class Material {
    constructor(programData, imageSrc) {
        this.programData = programData;
        this.texture = loadTextureAsync(imageSrc);
    }

    getProgramData() {
        return this.programData;
    }

    getTexture() {
        return this.texture;
    }
}
