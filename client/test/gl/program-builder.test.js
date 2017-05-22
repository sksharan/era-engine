import ProgramBuilderInjector from 'inject-loader!../../main/source/gl/program-builder'
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
    const positionLocations = ['position', 'modelMatrix', 'viewMatrix', 'projectionMatrix'];
    const normalLocations = ['normal', 'normalMatrix'];
    const texcoordLocations = ['texcoord'];
    const phongLightingLocations = ['cameraPosition'];

    beforeEach(function() {
        builder = new ProgramBuilder();
    });

    it('should succeed with default configuration', function() {
        const programData = builder.build();
        assertProgramLocations(programData, []);
    });

    it('should succeed with position enabled', function() {
        const programData = builder
                .addPosition()
                .build();
        assertProgramLocations(programData, positionLocations);
    });

    it('should succeed with position and normal enabled', function() {
        const programData = builder
                .addPosition()
                .addNormal()
                .build();
        assertProgramLocations(programData, positionLocations.concat(normalLocations));
    });

    it('should succeed with position and texcoord enabled', function() {
        const programData = builder
                .addPosition()
                .addTexcoord()
                .build();
        assertProgramLocations(programData, positionLocations.concat(texcoordLocations));
    });

    it('should succeed with position, normal, and phong lighting enabled', function() {
        const programData = builder
                .addPosition()
                .addNormal()
                .addPhongLighting()
                .build();
        assertProgramLocations(programData,
            positionLocations.concat(normalLocations).concat(phongLightingLocations));
    });

});

/* Assert that the given attribute and uniform 'locations' are the only
   locations present in 'programData'. */
function assertProgramLocations(programData, locations) {
    assert.isNotNull(programData.program);

    if (locations.includes('position')) {
        assert.isTrue(programData.hasPositionAttributeLocation());
    } else {
        assert.isFalse(programData.hasPositionAttributeLocation());
    }

    if (locations.includes('normal')) {
        assert.isTrue(programData.hasNormalAttributeLocation());
    } else {
        assert.isFalse(programData.hasNormalAttributeLocation());
    }

    if (locations.includes('texcoord')) {
        assert.isTrue(programData.hasTexcoordAttributeLocation());
    } else {
        assert.isFalse(programData.hasTexcoordAttributeLocation());
    }

    if (locations.includes('modelMatrix')) {
        assert.isTrue(programData.hasModelMatrixUniformLocation());
    } else {
        assert.isFalse(programData.hasModelMatrixUniformLocation());
    }

    if (locations.includes('viewMatrix')) {
        assert.isTrue(programData.hasViewMatrixUniformLocation());
    } else {
        assert.isFalse(programData.hasViewMatrixUniformLocation());
    }

    if (locations.includes('projectionMatrix')) {
        assert.isTrue(programData.hasProjectionMatrixUniformLocation());
    } else {
        assert.isFalse(programData.hasProjectionMatrixUniformLocation());
    }

    if (locations.includes('normalMatrix')) {
        assert.isTrue(programData.hasNormalMatrixUniformLocation());
    } else {
        assert.isFalse(programData.hasNormalMatrixUniformLocation());
    }

    if (locations.includes('cameraPosition')) {
        assert.isTrue(programData.hasCameraPositionUniformLocation());
    } else {
        assert.isFalse(programData.hasCameraPositionUniformLocation());
    }
}
