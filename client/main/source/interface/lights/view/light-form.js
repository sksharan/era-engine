import React from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import {gql, graphql} from 'react-apollo'
import FetchLightsQuery from '../query/fetch-lights'
import LightSelect from '../query/light-select'
import css from './styles/light-form.scss'

class LightForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ''
        };
        this.handleNameChange = this.handleNameChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    handleNameChange(event) {
        this.setState({name: event.target.value});
    }

    submitForm() {
        const name = this.state.name ? this.state.name : "Light";
        this.props.saveLight(name);
    }

    render() {
        return (
            <li className={`${css.form} list-group-item p-1`}>
                <input className="form-control form-control-sm" type="text" placeholder="Name" value={this.state.name} onChange={this.handleNameChange} />
                <span>&nbsp;</span>
                <button type='button' className='btn btn-success btn-sm' onClick={() => this.submitForm()}>
                    <FontAwesome name='plus' className='align-middle' />
                </button>
            </li>
        );
    }
}

LightForm.propTypes = {
    saveLight: PropTypes.func.isRequired
}

const saveLightMutation = gql`
    mutation saveLight($name: String!) {
        saveLight(light: {
            name: $name,
            type: "POINT",
            position: {x: 60, y: 20, z: 60},
            direction: {x: 0, y: -1, z: 0},
            ambient: {r: 0.1, g: 0.1, b: 0.1, a: 1},
            diffuse: {r: 0.8, g: 0.8, b: 0.8, a: 1},
            specular: {r: 0.8, g: 0.6, b: 0.6, a: 1},
            specularTerm: 100,
            quadraticAttenuation: 0.0007,
            linearAttenuation: 0.014,
            constantAttenuation: 1}) {

            ${LightSelect}
        }
    }
`;

export const LightFormPresentation = LightForm;
export const LightFormContainer = graphql(saveLightMutation, {
    props: ({mutate}) => ({
        saveLight: (name) => mutate({
            variables: {name},
            refetchQueries: [{
                query: FetchLightsQuery
            }]
        })
    })
})(LightForm);
