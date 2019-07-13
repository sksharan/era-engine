import {assert} from 'chai';
import {Ray, toRay} from '../ray';
import {vec3} from 'gl-matrix';

describe('Ray constructor', () => {
    it('should validate origin type', () => {
        assert.throws(() => new Ray('bad origin', vec3.create()), 'Origin must be a vec3 (Float32Array)');
    });
    it('should validate direction type', () => {
        assert.throws(() => new Ray(vec3.create(), 'bad direction'), 'Origin must be a vec3 (Float32Array)');
    });
    it('should create valid Ray object', () => {
        const origin = vec3.create();
        const direction = vec3.create();
        const ray = new Ray(origin, direction);
        assert.equal(ray.origin, origin);
        assert.equal(ray.direction, direction);
    });
});
describe('toRay', () => {
    it('should return a valid Ray object', () => {
        const mouseX = 0;
        const mouseY = 0;
        assert.instanceOf(toRay(mouseX, mouseY), Ray);
    });
});
