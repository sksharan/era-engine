import SceneNode from './scene-node'
import Light from '../light'

export default class LightNode extends SceneNode {
    constructor(localMatrix, light) {
        super(localMatrix);
        this._nodeType = "LIGHT";
        this._light = new Light(light);
    }

    get light() {
        return this._light;
    }

    set light(light) {
        this._light = new Light(light);
    }
}
