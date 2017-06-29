import SceneNode from './scene-node';

export default class LightNode extends SceneNode {
    constructor(localMatrix, {light}) {
        super(localMatrix);
        this._nodeType = "LIGHT";
        this._light = light;
    }
}
