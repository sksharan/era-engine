const GLOBAL_ORIENTATION = Symbol('GLOBAL');
const LOCAL_ORIENTATION = Symbol('LOCAL');

class TransformOrientation {
    constructor() {
        this._orientation = GLOBAL_ORIENTATION;
    }
    setGlobal() {
        this._orientation = GLOBAL_ORIENTATION;
    }
    setLocal() {
        this._orientation = LOCAL_ORIENTATION;
    }
    isGlobal() {
        return this._orientation === GLOBAL_ORIENTATION;
    }
    isLocal() {
        return this._orientation === LOCAL_ORIENTATION;
    }
    get orientation() {
        return this._orientation;
    }
}
export const CurrentTransformOrientation = new TransformOrientation();
