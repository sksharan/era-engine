export const getSceneNode = ({name, path, type}) => ({
    name: name || 'name',
    type: type || 'DEFAULT',
    localMatrix: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    path: path || '/abc'
});

export const getLight = () => {
    return {
        type: 'POINT',
        ambient: {r: 1, g: 0, b: 0, a: 0.25},
        diffuse: {r: 0, g: 1, b: 0, a: 0.5},
        specular: {r: 0, g: 0, b: 1, a: 0.75},
        specularTerm: 100,
        quadraticAttenuation: 1,
        linearAttenuation: 2,
        constantAttenuation: 3
    };
};
