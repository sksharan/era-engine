import ProgramBuilderInjector from 'inject-loader!../program-builder'
import {assert} from 'chai'

// Setup WebGL
document.body.insertAdjacentHTML('beforeend',
        '<canvas id="canvas" height="720" width="1080"></canvas>');
const gl = document.getElementById('canvas').getContext('webgl');

const ProgramBuilder = ProgramBuilderInjector({
    '../gl': {
        gl: gl
    }
}).default;

describe('Program builder build', function() {

    let builder = null;

    beforeEach(function() {
        builder = new ProgramBuilder();
    });

    it('should succeed with default configuration', function() {
        builder.build();
    });

    it('should succeed with position enabled', function() {
        builder.addPosition().build();
    });

    it('should succeed with position and normal enabled', function() {
        builder.addPosition().addNormal().build();
    });

    it('should succeed with position and texcoord enabled', function() {
        builder.addPosition().addTexcoord().build();
    });

    it('should succeed with position, normal, and lighting enabled', function() {
        builder.addPosition().addNormal().enableLighting().build();
    });

    it('should succeed when adding point lights', function() {
        builder.addPosition()
               .addNormal()
               .enableLighting()
               .addPointLight('light1')
               .addPointLight('light2')
               .build();
    });

    it('should build program data with billboard enabled if addBillboardPosition() is called', function() {
        assert.isTrue(builder.addBillboardPosition().build().billboardEnabled);
    });

    it('should not build program data with billboard enabled if addBillboardPosition() is never called', function() {
        assert.isFalse(builder.build().billboardEnabled);
    });

    it('should build program data with light enabled if enableLighting() is called', function() {
        assert.isTrue(builder.addPosition().addNormal().enableLighting().build().lightEnabled);
    });

    it('should not build program data with light enabled if enableLighting() is never called', function() {
        assert.isFalse(builder.build().lightEnabled);
    });

});
