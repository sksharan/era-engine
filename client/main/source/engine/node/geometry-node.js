import {RenderNode} from './render-node';
import {RenderNodeType} from './render-node-type'

export class GeometryNode extends RenderNode {
    constructor(localMatrix, {mesh, material}) {
        super(localMatrix);
        this._nodeType = RenderNodeType.GEOMETRY;
        /* The mesh to render. */
        this._mesh = mesh;
        /* The material to associate with the mesh. */
        this._material = material;
    }

    get mesh() {
        return this._mesh;
    }
    get material() {
        return this._material;
    }
}
