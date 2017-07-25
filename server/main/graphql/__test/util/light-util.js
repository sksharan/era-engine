import stringifyObject from 'stringify-object';

export const getLight = (id=null, existingLight=null) => {
    const light = existingLight
        ? Object.assign({}, existingLight)
        : {
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
    if (id) {
        light.id = id;
    }
    return light;
}

export const stringifyLight = (light) => {
    // When used in a mutation, light object cannot have quotes
    // around the object keys
    return stringifyObject(light, {singleQuotes: false});
}

export const LightSelectFields = `
    id
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
