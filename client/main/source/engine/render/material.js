/* Material that can associated with a mesh that determines
   the renderable properties of that mesh. */

import {loadTextureAsync} from '../gl-utils'

export default class Material {
    constructor(programData, imageSrc) {
        this._programData = programData;
        this._texture = loadTextureAsync(imageSrc);
    }

    get programData() {
        return this._programData;
    }

    get texture() {
        return this._texture;
    }
}
