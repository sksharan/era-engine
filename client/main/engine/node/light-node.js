import {RenderNode} from './render-node'
import {Light} from '../light/index'
import {RenderNodeType} from './render-node-type'
import {mat4} from 'gl-matrix'

export class LightNode extends RenderNode {
    constructor({localMatrix=mat4.create(), light}) {
        if (!light) {
            throw new TypeError('Light is required');
        }
        super({localMatrix});
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
