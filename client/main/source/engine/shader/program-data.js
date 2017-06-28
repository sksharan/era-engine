function isValidLocation(location) {
    return location !== null && location !== undefined && location !== -1;
}

export default class ProgramData {
    constructor() {
        this._program = null;

        this._positionAttributeLocation = null;
        this._normalAttributeLocation = null;
        this._texcoordAttributeLocation = null;

        this._modelMatrixUniformLocation = null;
        this._viewMatrixUniformLocation = null;
        this._projectionMatrixUniformLocation = null;
        this._normalMatrixUniformLocation = null;
        this._cameraPositionUniformLocation = null;
    }

    get program() {
        return this._program;
    }
    set program(program) {
        this._program = program;
    }

    hasPositionAttributeLocation() {
        return isValidLocation(this._positionAttributeLocation);
    }
    get positionAttributeLocation() {
        return this._positionAttributeLocation;
    }
    set positionAttributeLocation(location) {
        this._positionAttributeLocation = location;
    }

    hasNormalAttributeLocation() {
        return isValidLocation(this._normalAttributeLocation);
    }
    get normalAttributeLocation() {
        return this._normalAttributeLocation;
    }
    set normalAttributeLocation(location) {
        this._normalAttributeLocation = location;
    }

    hasTexcoordAttributeLocation() {
        return isValidLocation(this._texcoordAttributeLocation);
    }
    get texcoordAttributeLocation() {
        return this._texcoordAttributeLocation;
    }
    set texcoordAttributeLocation(location) {
        this._texcoordAttributeLocation = location;
    }

    hasModelMatrixUniformLocation() {
        return isValidLocation(this._modelMatrixUniformLocation);
    }
    get modelMatrixUniformLocation() {
        return this._modelMatrixUniformLocation;
    }
    set modelMatrixUniformLocation(location) {
        this._modelMatrixUniformLocation = location;
    }

    hasViewMatrixUniformLocation() {
        return isValidLocation(this._viewMatrixUniformLocation);
    }
    get viewMatrixUniformLocation() {
        return this._viewMatrixUniformLocation;
    }
    set viewMatrixUniformLocation(location) {
        this._viewMatrixUniformLocation = location;
    }

    hasProjectionMatrixUniformLocation() {
        return isValidLocation(this._projectionMatrixUniformLocation);
    }
    get projectionMatrixUniformLocation() {
        return this._projectionMatrixUniformLocation;
    }
    set projectionMatrixUniformLocation(location) {
        this._projectionMatrixUniformLocation = location;
    }

    hasNormalMatrixUniformLocation() {
        return isValidLocation(this._normalMatrixUniformLocation);
    }
    get normalMatrixUniformLocation() {
        return this._normalMatrixUniformLocation;
    }
    set normalMatrixUniformLocation(location) {
        this._normalMatrixUniformLocation = location;
    }

    hasCameraPositionUniformLocation() {
        return isValidLocation(this._cameraPositionUniformLocation);
    }
    get cameraPositionUniformLocation() {
        return this._cameraPositionUniformLocation;
    }
    set cameraPositionUniformLocation(location) {
        this._cameraPositionUniformLocation = location;
    }
}
