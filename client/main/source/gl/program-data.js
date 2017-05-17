function ProgramData() {
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

function isValidLocation(location) {
    return location !== null && location !== undefined && location !== -1;
}

ProgramData.prototype.getProgram = function() {
    return this.program;
}
ProgramData.prototype.setProgram = function(program) {
    this.program = program;
}

ProgramData.prototype.hasPositionAttributeLocation = function() {
    return isValidLocation(this.positionAttributeLocation);
}
ProgramData.prototype.getPositionAttributeLocation = function() {
    return this.positionAttributeLocation;
}
ProgramData.prototype.setPositionAttributeLocation = function(location) {
    this.positionAttributeLocation = location;
}

ProgramData.prototype.hasNormalAttributeLocation = function() {
    return isValidLocation(this.normalAttributeLocation);
}
ProgramData.prototype.getNormalAttributeLocation = function() {
    return this.normalAttributeLocation;
}
ProgramData.prototype.setNormalAttributeLocation = function(location) {
    this.normalAttributeLocation = location;
}

ProgramData.prototype.hasTexcoordAttributeLocation = function() {
    return isValidLocation(this.texcoordAttributeLocation);
}
ProgramData.prototype.getTexcoordAttributeLocation = function() {
    return this.texcoordAttributeLocation;
}
ProgramData.prototype.setTexcoordAttributeLocation = function(location) {
    this.texcoordAttributeLocation = location;
}

ProgramData.prototype.hasModelMatrixUniformLocation = function() {
    return isValidLocation(this.modelMatrixUniformLocation);
}
ProgramData.prototype.getModelMatrixUniformLocation = function() {
    return this.modelMatrixUniformLocation;
}
ProgramData.prototype.setModelMatrixUniformLocation = function(location) {
    this.modelMatrixUniformLocation = location;
}

ProgramData.prototype.hasViewMatrixUniformLocation = function() {
    return isValidLocation(this.viewMatrixUniformLocation);
}
ProgramData.prototype.getViewMatrixUniformLocation = function() {
    return this.viewMatrixUniformLocation;
}
ProgramData.prototype.setViewMatrixUniformLocation = function(location) {
    this.viewMatrixUniformLocation = location;
}

ProgramData.prototype.hasProjectionMatrixUniformLocation = function() {
    return isValidLocation(this.projectionMatrixUniformLocation);
}
ProgramData.prototype.getProjectionMatrixUniformLocation = function() {
    return this.projectionMatrixUniformLocation;
}
ProgramData.prototype.setProjectionMatrixUniformLocation = function(location) {
    this.projectionMatrixUniformLocation = location;
}

ProgramData.prototype.hasNormalMatrixUniformLocation = function() {
    return isValidLocation(this.normalMatrixUniformLocation);
}
ProgramData.prototype.getNormalMatrixUniformLocation = function() {
    return this.normalMatrixUniformLocation;
}
ProgramData.prototype.setNormalMatrixUniformLocation = function(location) {
    this.normalMatrixUniformLocation = location;
}

ProgramData.prototype.hasCameraPositionUniformLocation = function() {
    return isValidLocation(this.cameraPositionUniformLocation);
}
ProgramData.prototype.getCameraPositionUniformLocation = function() {
    return this.cameraPositionUniformLocation;
}
ProgramData.prototype.setCameraPositionUniformLocation = function(location) {
    this.cameraPositionUniformLocation = location;
}

module.exports = ProgramData;
