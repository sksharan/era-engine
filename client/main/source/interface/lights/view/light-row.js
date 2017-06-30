import React from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import {gql, graphql, compose} from 'react-apollo'
import FetchLightsQuery from '../query/fetch-lights'
import LightSelect from '../query/light-select'
import SmallColorPicker from '../../common/component/small-color-picker'
import css from './styles/light-row.scss'

class LightRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.light.name,
            ambient: this.props.light.ambient,
            diffuse: this.props.light.diffuse,
            specular: this.props.light.specular
        }
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleAmbientChangeComplete = this.handleAmbientChangeComplete.bind(this);
        this.handleDiffuseChangeComplete = this.handleDiffuseChangeComplete.bind(this);
        this.handleSpecularChangeComplete = this.handleSpecularChangeComplete.bind(this);
        this.updateLight = this.updateLight.bind(this);
        this.deleteLight = this.deleteLight.bind(this);
    }

    handleNameChange(event) {
        this.setState({name: event.target.value}, () => this.updateLight());
    }

    handleAmbientChangeComplete(event) {
        this.setState({ambient: this.convertColor(event.rgb)}, () => this.updateLight());
    }
    handleDiffuseChangeComplete(event) {
        this.setState({diffuse: this.convertColor(event.rgb)}, () => this.updateLight());
    }
    handleSpecularChangeComplete(event) {
        this.setState({specular: this.convertColor(event.rgb)}, () => this.updateLight());
    }
    convertColor(color) {
        return {r: color.r/255.0, g: color.g/255.0, b: color.b/255.0, a: color.a};
    }

    updateLight() {
        this.props.saveLight({
            id: this.props.light.id,
            name: this.state.name,
            type: this.props.light.type,
            position: this.getObjectForUpdate(this.props.light.position),
            direction: this.getObjectForUpdate(this.props.light.direction),
            ambient: this.getObjectForUpdate(this.state.ambient),
            diffuse: this.getObjectForUpdate(this.state.diffuse),
            specular: this.getObjectForUpdate(this.state.specular),
            specularTerm: this.props.light.specularTerm,
            quadraticAttenuation: this.props.light.quadraticAttenuation,
            linearAttenuation: this.props.light.linearAttenuation,
            constantAttenuation: this.props.light.constantAttenuation
        });
    }
    getObjectForUpdate(obj) {
        const copy = Object.assign({}, obj);
        delete copy.__typename;
        return copy;
    }

    deleteLight() {
        this.props.deleteLight(this.props.light.id);
    }

    render() {
        return (
            <li className={`list-group-item list-group-item-action flex-column align-items-start ${css.row}`}>
                <div className="d-flex w-100 justify-content-between">
                    <div className={`${css.item}`}>
                        {this.props.light.type}
                    </div>
                    <div className={`${css.item}`}>
                        <input className="form-control form-control-sm" type="text"
                                value={this.state.name} onChange={this.handleNameChange}  />
                    </div>
                    <div className={`${css.item}`}>
                        <SmallColorPicker color={this.props.light.ambient}
                                onChangeComplete={this.handleAmbientChangeComplete} />
                    </div>
                    <div className={`${css.item}`}>
                        <SmallColorPicker color={this.props.light.diffuse}
                                onChangeComplete={this.handleDiffuseChangeComplete} />
                    </div>
                    <div className={`${css.item}`}>
                        <SmallColorPicker color={this.props.light.specular}
                                onChangeComplete={this.handleSpecularChangeComplete} />
                    </div>
                    <div className={`${css.item}`}>
                        <button type='button' className={`btn btn-danger btn-sm ${css.deleteLightButton}`} onClick={() => this.deleteLight()}>
                            <FontAwesome name='close' className='align-middle' />
                        </button>
                    </div>
                </div>
            </li>
        );
    }
}

LightRow.propTypes = {
    light: PropTypes.object.isRequired,
    deleteLight: PropTypes.func.isRequired,
    saveLight: PropTypes.func.isRequired
};

const deleteLightMutation = gql`
    mutation deleteLight($id: String!) {
        deleteLight(id: $id) {
            ${LightSelect}
        }
    }
`;

const saveLightMutation = gql`
    mutation saveLight($light: LightInput!) {
        saveLight(light: $light) {
            ${LightSelect}
        }
    }
`;

export const LightRowPresentation = LightRow;
export const LightRowContainer = compose(
    graphql(deleteLightMutation, {
        props: ({mutate}) => ({
            deleteLight: (id) => mutate({
                variables: {id},
                refetchQueries: [{
                    query: FetchLightsQuery
                }]
            })
        })
    }),
    graphql(saveLightMutation, {
        props: ({mutate}) => ({
            saveLight: (light) => mutate({
                variables: {light},
                refetchQueries: [{
                    query: FetchLightsQuery
                }]
            })
        })
    })
)(LightRow);
