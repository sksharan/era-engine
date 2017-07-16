export default class Light {
    constructor({id, type, direction, ambient, diffuse, specular, specularTerm,
        quadraticAttenuation, linearAttenuation, constantAttenuation}) {

        this._id = id;
        this._type = type;
        this._direction = direction;
        this._ambient = ambient;
        this._diffuse = diffuse;
        this._specular = specular;
        this._specularTerm = specularTerm;
        this._quadraticAttenuation = quadraticAttenuation;
        this._linearAttenuation = linearAttenuation;
        this._constantAttenuation = constantAttenuation;
    }

    get id() {
        return this._id;
    }
    get type() {
        return this._type;
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
    get specularTerm() {
        return this._specularTerm;
    }
    get quadraticAttenuation() {
        return this._quadraticAttenuation;
    }
    get linearAttenuation() {
        return this._linearAttenuation;
    }
    get constantAttenuation() {
        return this._constantAttenuation;
    }

    set id(id) {
        this._id = id;
    }
    set type(type) {
        this._type = type;
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
    set specularTerm(specularTerm) {
        this._specularTerm = specularTerm;
    }
    set quadraticAttenuation(quadraticAttenuation) {
        return this._quadraticAttenuation = quadraticAttenuation;
    }
    set linearAttenuation(linearAttenuation) {
        return this._linearAttenuation = linearAttenuation;
    }
    set constantAttenuation(constantAttenuation) {
        return this._constantAttenuation = constantAttenuation;
    }
}
