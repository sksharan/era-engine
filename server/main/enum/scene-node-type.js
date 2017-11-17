const DEFAULT = 'DEFAULT';
const LIGHT = 'LIGHT';
const OBJECT = 'OBJECT';
const OBJECT_REF = 'OBJECT_REF';

export const SceneNodeType = {
    DEFAULT,
    LIGHT,
    OBJECT,
    OBJECT_REF,

    isValidType(type) {
        return [DEFAULT, LIGHT, OBJECT, OBJECT_REF].includes(type);
    }
}
