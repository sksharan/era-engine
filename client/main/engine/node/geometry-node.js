import {RenderNode} from './render-node';
import {RenderNodeType} from './render-node-type'
import {mat4} from 'gl-matrix'

export class GeometryNode extends RenderNode {
    constructor({id, localMatrix=mat4.create(), mesh, material}) {
        if (!mesh) {
            throw new TypeError('Mesh is required');
        }
        if (!material) {
            throw new TypeError('Material is required');
        }
        super({id, localMatrix});
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
