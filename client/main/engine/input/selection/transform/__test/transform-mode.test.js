import {assert} from 'chai';
import {TRANSLATE, SCALE, ROTATE, CurrentTransformMode} from '../transform-mode';

describe('Current transform mode', () => {
    it('can be set to translate', () => {
        CurrentTransformMode.setTranslate();
        assert.equal(CurrentTransformMode.getCurrent(), TRANSLATE);
    });
    it('can be set to scale', () => {
        CurrentTransformMode.setScale();
        assert.equal(CurrentTransformMode.getCurrent(), SCALE);
    });
    it('can be set to rotate', () => {
        CurrentTransformMode.setRotate();
        assert.equal(CurrentTransformMode.getCurrent(), ROTATE);
    });
});
