import React from 'react'
import PropTypes from 'prop-types'
import {Matrix3x3} from './matrix-3x3'
import {Matrix4x4} from './matrix-4x4'

export class NodeProperties extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className='row'>
                    <div className={`col-md-${this.props.keyWidth}`}>
                        ID
                    </div>
                    <div className={`col-md-${this.props.valueWidth}`}>
                        {this.props.node.renderNode.id}
                    </div>
                </div>
                <div className='row'>
                    <div className={`col-md-${this.props.keyWidth}`}>
                        Name
                    </div>
                    <div className={`col-md-${this.props.valueWidth}`}>
                        {this.props.node.sceneNode.name}
                    </div>
                </div>
                <div className='row'>
                    <div className={`col-md-${this.props.keyWidth}`}>
                        Type
                    </div>
                    <div className={`col-md-${this.props.valueWidth}`}>
                        {this.props.node.sceneNode.type}/{this.props.node.renderNode.nodeType}
                    </div>
                </div>
                <div className='row'>
                    <div className={`col-md-${this.props.keyWidth}`}>
                        Local Matrix
                    </div>
                    <div className={`col-md-${this.props.valueWidth}`}>
                        <Matrix4x4 matrix={this.props.node.renderNode.localMatrix} />
                    </div>
                </div>
                <div className='row'>
                    <div className={`col-md-${this.props.keyWidth}`}>
                        World Matrix
                    </div>
                    <div className={`col-md-${this.props.valueWidth}`}>
                        <Matrix4x4 matrix={this.props.node.renderNode.worldMatrix} />
                    </div>
                </div>
                <div className='row'>
                    <div className={`col-md-${this.props.keyWidth}`}>
                        Normal Matrix
                    </div>
                    <div className={`col-md-${this.props.valueWidth}`}>
                        <Matrix3x3 matrix={this.props.node.renderNode.normalMatrix} />
                    </div>
                </div>
            </div>
        );
    }
}

NodeProperties.propTypes = {
    node: PropTypes.shape({
        sceneNode: PropTypes.shape({
            name: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
        }),
        renderNode: PropTypes.shape({
            id: PropTypes.string.isRequired,
            nodeType: PropTypes.string.isRequired,
            localMatrix: PropTypes.object.isRequired, // Float32Array
            worldMatrix: PropTypes.object.isRequired, // Float32Array
            normalMatrix: PropTypes.object.isRequired, // Float32Array
        }),
    }),
    keyWidth: PropTypes.number.isRequired,
    valueWidth: PropTypes.number.isRequired,
}
