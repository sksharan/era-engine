import SceneNode from './scene-node';

export default class GeometryNode extends SceneNode {
    constructor(localMatrix, {mesh, material}) {
        super(localMatrix);
        this._nodeType = "GEOMETRY";
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
