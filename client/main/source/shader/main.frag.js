'use strict';

module.exports =
    `
    precision mediump float;

    uniform sampler2D texture;
    uniform vec3 cameraPosition;

    varying vec4 vPositionWorld;
    varying vec3 vNormalWorld;
    varying vec2 vTexcoord;

    //TODO refactor
    vec3 lightPositionWorld = vec3(60, 20, 60);
    vec3 lightAmbient = vec3(0.1, 0.1, 0.1);
    vec3 lightDiffuse = vec3(0.8, 0.8, 0.8);
    vec3 lightSpecular = vec3(0.8, 0.6, 0.6);
    float specularTerm = 100.0;

    vec3 materialAmbient = vec3(0.1, 0.1, 0.1);
    vec3 materialDiffuse = vec3(0.5, 0.5, 0.5);
    vec3 materialSpecular = vec3(0.8, 0.8, 0.8);

    void main() {
        vec4 fragColor;

        // Apply texture
        //fragColor = texture2D(texture, vTexcoord);

        // Apply ambient lighting
        fragColor += vec4(lightAmbient, 1.0) * vec4(materialAmbient, 1.0);

        // Set up vectors for diffuse and specular calculations
        vec3 lightDirection = normalize(lightPositionWorld - vec3(vPositionWorld));
        vec3 lightReflect = reflect(-lightDirection, vNormalWorld);
        vec3 viewerDirection = normalize(cameraPosition - vec3(vPositionWorld));

        // Apply diffuse lighting
        fragColor += vec4(lightDiffuse, 1.0) * vec4(materialDiffuse, 1.0)
                    * max(0.0, dot(vNormalWorld, lightDirection));

        // Apply specular lighting
        fragColor += vec4(lightSpecular, 1.0) * vec4(materialSpecular, 1.0)
                    * pow(max(0.0, dot(viewerDirection, lightReflect)), specularTerm);

        gl_FragColor = fragColor;
    }
    `;
