import {assert} from 'chai';
import {SelectionState} from '../selection-state';

describe('SelectionState base class', () => {
    it('cannot be instantiated directly', () => {
        assert.throws(() => new SelectionState(), 'Cannot instantiate SelectionState directly');
    });
});
