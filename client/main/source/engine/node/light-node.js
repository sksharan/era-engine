import SceneNode from './scene-node'
import {Light} from '../light/index'
import {SceneNodeType} from './scene-node-type'

export default class LightNode extends SceneNode {
    constructor(localMatrix, light) {
        super(localMatrix);
        this._nodeType = SceneNodeType.LIGHT;
        this._light = new Light(light);
    }

    get light() {
        return this._light;
    }

    set light(light) {
        this._light = new Light(light);
    }
}
