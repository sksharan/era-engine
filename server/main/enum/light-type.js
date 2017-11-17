const POINT = 'POINT';

export const LightType = {
    POINT,

    isValidType(type) {
        return [POINT].includes(type);
    }
}
