export default class Light {
    constructor({id, name, type, position, direction, ambient, diffuse, specular, intensity}) {
        this._id = id;
        this._name = name;
        this._type = type;
        this._position = position;
        this._direction = direction;
        this._ambient = ambient;
        this._diffuse = diffuse;
        this._specular = specular;
        this._intensity = intensity;
    }

    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get type() {
        return this._type;
    }
    get position() {
        return this._position;
    }
    get direction() {
        return this._direction;
    }
    get ambient() {
        return this._ambient;
    }
    get diffuse() {
        return this._diffuse;
    }
    get specular() {
        return this._specular;
    }
    get intensity() {
        return this._intensity;
    }

    set id(id) {
        this._id = id;
    }
    set name(name) {
        this._name = name;
    }
    set type(type) {
        this._type = type;
    }
    set position(position) {
        this._position = position;
    }
    set direction(direction) {
        this._direction = direction;
    }
    set ambient(ambient) {
        this._ambient = ambient;
    }
    set diffuse(diffuse) {
        this._diffuse = diffuse;
    }
    set specular(specular) {
        this._specular = specular;
    }
    set intensity(intensity) {
        this._intensity = intensity;
    }
}
