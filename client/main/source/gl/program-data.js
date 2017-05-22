function isValidLocation(location) {
    return location !== null && location !== undefined && location !== -1;
}

export default class ProgramData {
    constructor() {
        this.program = null;

        this.positionAttributeLocation = null;
        this.normalAttributeLocation = null;
        this.texcoordAttributeLocation = null;

        this.modelMatrixUniformLocation = null;
        this.viewMatrixUniformLocation = null;
        this.projectionMatrixUniformLocation = null;
        this.normalMatrixUniformLocation = null;
        this.cameraPositionUniformLocation = null;
    }

    getProgram() {
        return this.program;
    }
    setProgram(program) {
        this.program = program;
    }

    hasPositionAttributeLocation() {
        return isValidLocation(this.positionAttributeLocation);
    }
    getPositionAttributeLocation() {
        return this.positionAttributeLocation;
    }
    setPositionAttributeLocation(location) {
        this.positionAttributeLocation = location;
    }

    hasNormalAttributeLocation() {
        return isValidLocation(this.normalAttributeLocation);
    }
    getNormalAttributeLocation() {
        return this.normalAttributeLocation;
    }
    setNormalAttributeLocation(location) {
        this.normalAttributeLocation = location;
    }

    hasTexcoordAttributeLocation() {
        return isValidLocation(this.texcoordAttributeLocation);
    }
    getTexcoordAttributeLocation() {
        return this.texcoordAttributeLocation;
    }
    setTexcoordAttributeLocation(location) {
        this.texcoordAttributeLocation = location;
    }

    hasModelMatrixUniformLocation() {
        return isValidLocation(this.modelMatrixUniformLocation);
    }
    getModelMatrixUniformLocation() {
        return this.modelMatrixUniformLocation;
    }
    setModelMatrixUniformLocation(location) {
        this.modelMatrixUniformLocation = location;
    }

    hasViewMatrixUniformLocation() {
        return isValidLocation(this.viewMatrixUniformLocation);
    }
    getViewMatrixUniformLocation() {
        return this.viewMatrixUniformLocation;
    }
    setViewMatrixUniformLocation(location) {
        this.viewMatrixUniformLocation = location;
    }

    hasProjectionMatrixUniformLocation() {
        return isValidLocation(this.projectionMatrixUniformLocation);
    }
    getProjectionMatrixUniformLocation() {
        return this.projectionMatrixUniformLocation;
    }
    setProjectionMatrixUniformLocation(location) {
        this.projectionMatrixUniformLocation = location;
    }

    hasNormalMatrixUniformLocation() {
        return isValidLocation(this.normalMatrixUniformLocation);
    }
    getNormalMatrixUniformLocation() {
        return this.normalMatrixUniformLocation;
    }
    setNormalMatrixUniformLocation(location) {
        this.normalMatrixUniformLocation = location;
    }

    hasCameraPositionUniformLocation() {
        return isValidLocation(this.cameraPositionUniformLocation);
    }
    getCameraPositionUniformLocation() {
        return this.cameraPositionUniformLocation;
    }
    setCameraPositionUniformLocation(location) {
        this.cameraPositionUniformLocation = location;
    }
}
