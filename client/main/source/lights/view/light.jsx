import React from 'react'
import PropTypes from 'prop-types'
import SmallColorPicker from '../../common/component/small-color-picker'
import {getRGBAObject} from '../../common/converter/color-converter'

export default class Light extends React.Component {
    constructor(props) {
        super(props);
        this.handleAmbientChangeComplete = this.handleAmbientChangeComplete.bind(this);
        this.handleDiffuseChangeComplete = this.handleDiffuseChangeComplete.bind(this);
        this.handleSpecularChangeComplete = this.handleSpecularChangeComplete.bind(this);
    }

    handleAmbientChangeComplete() {
        console.warn('Ambient changed'); //TODO
    }

    handleDiffuseChangeComplete() {
        console.warn('Diffuse changed'); //TODO
    }

    handleSpecularChangeComplete() {
        console.warn('Specular changed'); //TODO
    }

    render() {
        return (
            <li className='list-group-item list-group-item-action flex-column align-items-start p-1'>
                <div className="d-flex w-100">
                    <strong>
                        {this.props.light.getName()}
                    </strong>
                </div>
                <div className="d-flex w-100">
                    Position:&nbsp;&#40;
                        {this.props.light.getWorldPosition()[0]}&#44;
                        {this.props.light.getWorldPosition()[1]}&#44;
                        {this.props.light.getWorldPosition()[2]}&#41;
                </div>
                <div className="d-flex w-100 justify-content-between">
                    <div>
                        Ambient:&nbsp;<SmallColorPicker color={getRGBAObject(this.props.light.getAmbient())}
                                onChangeComplete={this.handleAmbientChangeComplete} />
                    </div>
                    <div>
                        Diffuse:&nbsp;<SmallColorPicker color={getRGBAObject(this.props.light.getDiffuse())}
                                onChangeComplete={this.handleDiffuseChangeComplete} />
                    </div>
                    <div>
                        Specular:&nbsp;<SmallColorPicker color={getRGBAObject(this.props.light.getSpecular())}
                                onChangeComplete={this.handleSpecularChangeComplete} />
                    </div>
                </div>
            </li>
        );
    }
}

Light.propTypes = {
    light: PropTypes.object.isRequired
};
