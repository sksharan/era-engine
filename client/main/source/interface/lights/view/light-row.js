import React from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import {gql, graphql, compose} from 'react-apollo'
import FetchLightsQuery from '../query/fetch-lights'
import LightSelect from '../query/light-select'
import SmallColorPicker from '../../common/component/small-color-picker'
import {
    FlatQuad,
    GeometryNode,
    LightNode,
    Material,
    ProgramBuilder
} from '../../../engine/index'
import {mat4, vec3} from 'gl-matrix'
import css from './styles/light-row.scss'

// Data for the icon associated with the light
const lightIconProgramData = new ProgramBuilder()
        .addBillboardPosition() // Icon always faces the user
        .addTexcoord()
        .addNormal()
        .build();
const lightIconMaterial = new Material({
    programData: lightIconProgramData,
    imageSrc: 'public/textures/light.png'
});

function createLightNode(light) {
    // Create the actual light node
    const lightNode = new LightNode(
        mat4.fromTranslation(
            mat4.create(),
            vec3.fromValues(60, 20, 60)),
        light);

    // Create a node for the icon that will indicate the light's position
    lightNode.addChild(new GeometryNode(mat4.create(), {mesh: new FlatQuad(), material: lightIconMaterial}));
    return lightNode;
}

class LightRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // Actual light properties
            light: this.props.light,
            // The node controlled by this component
            lightNode: createLightNode(this.props.light)
        }

        // This light node is a child of the node controlled by the parent component
        this.props.parentSceneNode.addChild(this.state.lightNode);

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleAmbientChangeComplete = this.handleAmbientChangeComplete.bind(this);
        this.handleDiffuseChangeComplete = this.handleDiffuseChangeComplete.bind(this);
        this.handleSpecularChangeComplete = this.handleSpecularChangeComplete.bind(this);
        this.updateLight = this.updateLight.bind(this);
        this.deleteLight = this.deleteLight.bind(this);
    }

    handleNameChange(event) {
        this.setState(
            {
                light: Object.assign({}, this.state.light, {name: event.target.value})
            },
            () => this.updateLight()
        );
    }

    handleAmbientChangeComplete(event) {
        this.setState(
            {
                light: Object.assign({}, this.state.light, {ambient: this.convertColor(event.rgb)})
            },
            () => this.updateLight()
        );
    }
    handleDiffuseChangeComplete(event) {
        this.setState(
            {
                light: Object.assign({}, this.state.light, {diffuse: this.convertColor(event.rgb)})
            },
            () => this.updateLight()
        );
    }
    handleSpecularChangeComplete(event) {
        this.setState(
            {
                light: Object.assign({}, this.state.light, {specular: this.convertColor(event.rgb)})
            },
            () => this.updateLight()
        );
    }
    convertColor(color) {
        return {r: color.r/255.0, g: color.g/255.0, b: color.b/255.0, a: color.a};
    }

    updateLight() {
        this.props.saveLight({
            id: this.state.light.id,
            name: this.state.light.name,
            type: this.state.light.type,
            ambient: this.getObjectForUpdate(this.state.light.ambient),
            diffuse: this.getObjectForUpdate(this.state.light.diffuse),
            specular: this.getObjectForUpdate(this.state.light.specular),
            specularTerm: this.state.light.specularTerm,
            quadraticAttenuation: this.state.light.quadraticAttenuation,
            linearAttenuation: this.state.light.linearAttenuation,
            constantAttenuation: this.state.light.constantAttenuation
        });

        // When a light updates, unbind the current node and attach a new one to the parent
        this.state.lightNode.removeParent();
        this.setState(
            {
                lightNode: createLightNode(this.state.light)
            },
            () => {
                this.props.parentSceneNode.addChild(this.state.lightNode);
            }
        )
    }
    getObjectForUpdate(obj) {
        const copy = Object.assign({}, obj);
        delete copy.__typename;
        return copy;
    }

    deleteLight() {
        this.props.deleteLight(this.props.light.id);
        // Unbind the node controlled by this component
        this.state.lightNode.removeParent();
    }

    render() {
        return (
            <li className={`list-group-item list-group-item-action flex-column align-items-start ${css.row}`}>
                <div className="d-flex w-100 justify-content-between">
                    <div className={`${css.item}`}>
                        {this.state.light.type}
                    </div>
                    <div className={`${css.item}`}>
                        <input className="form-control form-control-sm" type="text"
                                value={this.state.light.name} onChange={this.handleNameChange}  />
                    </div>
                    <div className={`${css.item}`}>
                        <SmallColorPicker color={this.state.light.ambient}
                                onChangeComplete={this.handleAmbientChangeComplete} />
                    </div>
                    <div className={`${css.item}`}>
                        <SmallColorPicker color={this.state.light.diffuse}
                                onChangeComplete={this.handleDiffuseChangeComplete} />
                    </div>
                    <div className={`${css.item}`}>
                        <SmallColorPicker color={this.state.light.specular}
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
    parentSceneNode: PropTypes.object.isRequired,
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
