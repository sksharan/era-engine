import React from 'react';
import {assert} from 'chai'
import {shallow} from 'enzyme'
import {List} from 'immutable'
import LightList from '../light-list'
import LightFormContainer from '../light-form-container'
import Light from '../light'
import LightObject from '../../light'

describe('<LightList />', () => {

    it('renders a <LightForm /> component with no <Light /> components', () => {
        const wrapper = shallow(<LightList lights={List()} />);
        assert.equal(wrapper.find(LightFormContainer).length, 1);
        assert.equal(wrapper.find(Light).length, 0);
    });

    it('renders three <Light /> components', () => {
        const lights = List()
            .push(new LightObject(1))
            .push(new LightObject(2))
            .push(new LightObject(3));

        const wrapper = shallow(<LightList lights={lights} />);
        assert.equal(wrapper.find(LightFormContainer).length, 1);
        assert.equal(wrapper.find(Light).length, 3);
    });

});
