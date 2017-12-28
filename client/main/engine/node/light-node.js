import {RenderNode} from './render-node'
import {Light} from '../light/index'
import {RenderNodeType} from './render-node-type'

export class LightNode extends RenderNode {
    constructor(localMatrix, light) {
        super(localMatrix);
        this._nodeType = RenderNodeType.LIGHT;
        this._light = new Light(light);
    }

    get light() {
        return this._light;
    }

    set light(light) {
        this._light = new Light(light);
    }
}
