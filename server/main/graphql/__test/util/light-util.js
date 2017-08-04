import stringifyObject from 'stringify-object';

export const getLight = () => {
    return {
        name: "Light",
        type: "POINT",
        ambient: {r: 1, g: 0, b: 0, a: 0.25},
        diffuse: {r: 0, g: 1, b: 0, a: 0.50},
        specular: {r: 0, g: 0, b: 1, a: 0.75},
        specularTerm: 100,
        quadraticAttenuation: 1,
        linearAttenuation: 2,
        constantAttenuation: 3
    };
}

export const stringifyLight = (light) => {
    // When used as a parameter to a mutation, cannot have quotes around property names
    return stringifyObject(light, {singleQuotes: false});
}

export const LightSelectFields = `
    name
    type
    ambient { r g b a }
    diffuse { r g b a }
    specular { r g b a }
    specularTerm
    quadraticAttenuation
    linearAttenuation
    constantAttenuation
`;
