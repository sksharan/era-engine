import reducer from '../reducer'
import {createLight} from '../actions'
import {List} from 'immutable'
import {assert} from 'chai'

describe('reducer', () => {

    it('should have an immutable empty list as the default state', () => {
        const nextState = reducer(undefined, {type: 'TEST'});
        assert.isTrue(List.isList(nextState));
        assert.equal(nextState.size, 0);
    });

    it('should add a new light to the state with the CREATE_LIGHT action', () => {
        const nextState = reducer(undefined, createLight('Name', 'POINT'));
        assert.isTrue(List.isList(nextState));
        assert.equal(nextState.size, 1);

        const light = nextState.get(0);
        assert.isTrue(light.getId() > 0);
        assert.equal(light.getName(), 'Name');
        assert.equal(light.getType(), 'POINT');
    });

    it('should not modify the current state with the CREATE_LIGHT action', () => {
        const state = new List().push("Some test data");
        reducer(state, createLight('Name', 'POINT'));

        assert.isTrue(List.isList(state));
        assert.equal(state.size, 1);
        assert.equal(state.get(0), "Some test data");
    })

});
