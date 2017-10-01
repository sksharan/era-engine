export const TRANSLATE = Symbol('TRANSLATE');
export const SCALE = Symbol('SCALE');
export const ROTATE = Symbol('ROTATE');

class TransformMode {
    constructor() {
        this._currTransformMode = TRANSLATE;
    }
    getCurrent() {
        return this._currTransformMode;
    }
    setTranslate() {
        this._currTransformMode = TRANSLATE;
    }
    setScale() {
        this._currTransformMode = SCALE;
    }
    setRotate() {
        this._currTransformMode = ROTATE;
    }
}
export const CurrentTransformMode = new TransformMode();
