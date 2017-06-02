export default class Light {
    constructor(id, name, type, worldPosition, ambient, diffuse, specular) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.worldPosition = worldPosition;
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
    }

    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getType() {
        return this.type;
    }
    getWorldPosition() {
        return this.worldPosition;
    }
    getAmbient() {
        return this.ambient;
    }
    getDiffuse() {
        return this.diffuse;
    }
    getSpecular() {
        return this.specular;
    }

    setId(id) {
        this.id = id;
    }
    setName(name) {
        this.name = name;
    }
    setType(type) {
        this.type = type;
    }
    setWorldPosition(worldPosition) {
        this.worldPosition = worldPosition;
    }
    setAmbient(ambient) {
        this.ambient = ambient;
    }
    setDiffuse(diffuse) {
        this.diffuse = diffuse;
    }
    setSpecular(specular) {
        this.specular = specular;
    }
}
