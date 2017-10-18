function isValidLocation(location) {
    return location !== null && location !== undefined && location !== -1;
}

let nextId = 1;

export default class ProgramData {
    constructor() {
        this._id = nextId++;
        this._program = null;

        this._positionAttributeLocation = null;
        this._normalAttributeLocation = null;
        this._texcoordAttributeLocation = null;

        this._modelMatrixUniformLocation = null;
        this._viewMatrixUniformLocation = null;
        this._projectionMatrixUniformLocation = null;
        this._normalMatrixUniformLocation = null;
        this._cameraPositionUniformLocation = null;
        this._colorUniformLocation = null;

        this._lightEnabled = false;
        this._billboardEnabled = false;
        this._positionScaleFactor = null;
    }

    // Copy data from the given 'programData' into this program data object
    update(programData) {
        this._program = programData._program;

        this._positionAttributeLocation = programData._positionAttributeLocation;
        this._normalAttributeLocation = programData._normalAttributeLocation;
        this._texcoordAttributeLocation = programData._texcoordAttributeLocation;

        this._modelMatrixUniformLocation = programData._modelMatrixUniformLocation;
        this._viewMatrixUniformLocation = programData._viewMatrixUniformLocation;
        this._projectionMatrixUniformLocation = programData._projectionMatrixUniformLocation;
        this._normalMatrixUniformLocation = programData._normalMatrixUniformLocation;
        this._cameraPositionUniformLocation = programData._cameraPositionUniformLocation;
        this._colorUniformLocation = programData._colorUniformLocation;

        this._lightEnabled = programData._lightEnabled;
        this._billboardEnabled = programData._billboardEnabled;
        this._positionScaleFactor = programData._positionScaleFactor;
    }

    get id() {
        return this._id;
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

    hasColorUniformLocation() {
        return isValidLocation(this._colorUniformLocation);
    }
    get colorUniformLocation() {
        return this._colorUniformLocation;
    }
    set colorUniformLocation(location) {
        this._colorUniformLocation = location;
    }

    get lightEnabled() {
        return this._lightEnabled;
    }
    set lightEnabled(lightEnabled) {
        this._lightEnabled = lightEnabled;
    }

    get billboardEnabled() {
        return this._billboardEnabled;
    }
    set billboardEnabled(billboardEnabled) {
        this._billboardEnabled = billboardEnabled;
    }

    hasPositionScaleFactor() {
        return this._positionScaleFactor !== null;
    }
    get positionScaleFactor() {
        return this._positionScaleFactor;
    }
    set positionScaleFactor(positionScaleFactor) {
        this._positionScaleFactor = positionScaleFactor;
    }
}
