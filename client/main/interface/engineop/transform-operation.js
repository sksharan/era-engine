import {CurrentTransformMode, CurrentTransformOrientation} from '../../engine/index';

export const setTranslate = () => {
    CurrentTransformMode.setTranslate();
};
export const setScale = () => {
    CurrentTransformMode.setScale();
};
export const setRotate = () => {
    CurrentTransformMode.setRotate();
};

export const setGlobalOrientation = () => {
    CurrentTransformOrientation.setGlobal();
};
export const setLocalOrientation = () => {
    CurrentTransformOrientation.setLocal();
};
