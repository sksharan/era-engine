export function getRGBAObject(vector) {
    return {
        r: (vector[0] * 255).toFixed(0),
        g: (vector[1] * 255).toFixed(0),
        b: (vector[2] * 255).toFixed(0),
        a: vector[3].toFixed(0)
    }
}
