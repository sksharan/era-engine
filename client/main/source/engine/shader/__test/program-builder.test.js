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

describe('Program builder build', () => {

    let builder = null;

    beforeEach(() => {
        builder = new ProgramBuilder();
    });

    it('should succeed with default configuration', () => {
        builder.build();
    });

    it('should succeed with position enabled', () => {
        builder.addPosition().build();
    });
    it('should set correct program data when position enabled', () => {
        const programData = builder.addPosition().build();
        assertPositionData(programData);
        assert.isFalse(programData.hasPositionScaleFactor());
    });
    it('should succeed with position enabled, scaling applied', () => {
        builder.addPosition({scaleFactor: 1.5}).build();
    });
    it('should set correct program data when position enabled, scaling applied', () => {
        const programData = builder.addPosition({scaleFactor: 1.5}).build();
        assertPositionData(programData);
        assert.isTrue(programData.hasPositionScaleFactor());
        assert.equal(1.5, programData.positionScaleFactor);
    });

    it('should succeed with position and billboard clipping enabled', () => {
        builder.addPosition().addBillboardClipping().build();
    });

    it('should succeed with billboard position enabled', () => {
        builder.addBillboardPosition().build();
    });
    it('should set correct program data when billboard position enabled', () => {
        const programData = builder.addBillboardPosition().build();
        assertPositionData(programData);
    });
    it('should succeed with billboard position enabled, scaling applied', () => {
        builder.addBillboardPosition({scaleFactor: 1.25}).build();
    });
    it('should set correct program data when billboard position enabled, scaling applied', () => {
        const programData = builder.addBillboardPosition({scaleFactor: 1.25}).build();
        assertPositionData(programData);
        assert.isTrue(programData.hasPositionScaleFactor());
        assert.equal(1.25, programData.positionScaleFactor);
    });

    it('should succeed with position and normal enabled', () => {
        builder.addPosition().addNormal().build();
    });
    it('should set correct program data when position and normal enabled', () => {
        const programData = builder.addPosition().addNormal().build();
        assertPositionData(programData);
        assertNormalData(programData);
    });

    it('should succeed with position and texcoord enabled', () => {
        builder.addPosition().addTexcoord().build();
    });
    it('should set correct program data when position and texcoord enabled', () => {
        const programData = builder.addPosition().addTexcoord().build();
        assertPositionData(programData);
        assertTexcoordData(programData);
    });

    it('should succeed with position, texcoord, and color enabled', () => {
        builder.addPosition().addTexcoord().addColor().build();
    });
    it('should set correct program data when position, texcoord, and color enabled', () => {
        const programData = builder.addPosition().addTexcoord().addColor().build();
        assertPositionData(programData);
        assertTexcoordData(programData);
        assertColorData(programData);
    });

    it('should succeed with position, normal, and lighting enabled', () => {
        builder.addPosition().addNormal().enableLighting().build();
    });
    it('should set correct program data when position, normal, and lighting enabled', () => {
        const programData = builder.addPosition().addNormal().enableLighting().build();
        assertPositionData(programData);
        assertNormalData(programData);
    });

    it('should succeed when adding point lights', () => {
        builder.addPosition()
               .addNormal()
               .enableLighting()
               .addPointLight('light1')
               .addPointLight('light2')
               .build();
    });
    it('should set correct program data when adding point lights', () => {
        const programData = builder.addPosition()
            .addNormal()
            .enableLighting()
            .addPointLight('light1')
            .addPointLight('light2')
            .build();
        assertPositionData(programData);
        assertNormalData(programData);
        assertLightingData(programData);
    });

    it('should build program data with billboard enabled if addBillboardPosition() is called', () => {
        assert.isTrue(builder.addBillboardPosition().build().billboardEnabled);
    });
    it('should not build program data with billboard enabled if addBillboardPosition() is never called', () => {
        assert.isFalse(builder.build().billboardEnabled);
    });

    it('should build program data with light enabled if enableLighting() is called', () => {
        assert.isTrue(builder.addPosition().addNormal().enableLighting().build().lightEnabled);
    });
    it('should not build program data with light enabled if enableLighting() is never called', () => {
        assert.isFalse(builder.build().lightEnabled);
    });

});

function assertPositionData(programData) {
    assert.isTrue(programData.hasPositionAttributeLocation());
    assert.isTrue(programData.hasModelMatrixUniformLocation());
    assert.isTrue(programData.hasViewMatrixUniformLocation());
    assert.isTrue(programData.hasProjectionMatrixUniformLocation());
}

function assertNormalData(programData) {
    assert.isTrue(programData.hasNormalAttributeLocation());
    assert.isTrue(programData.hasNormalMatrixUniformLocation());
}

function assertTexcoordData(programData) {
    assert.isTrue(programData.hasTexcoordAttributeLocation());
}

function assertColorData(programData) {
    assert.isTrue(programData.hasColorUniformLocation());
}

function assertLightingData(programData) {
    assert.isTrue(programData.hasCameraPositionUniformLocation());
}
