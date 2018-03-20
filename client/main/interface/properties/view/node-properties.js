import React from 'react'
import PropTypes from 'prop-types'
import {Matrix3x3} from './matrix-3x3'
import {Matrix4x4} from './matrix-4x4'
import {DefaultNodeProperties} from './default-node-properties'
import {ObjectNodeProperties} from './object-node-properties'
import {RenderNodeType} from '../../../engine/index'
import tableScss from '../scss/table.scss'

export class NodeProperties extends React.Component {
    constructor(props) {
        super(props);
        this._getNodeTypeSpecificProperties = this._getNodeTypeSpecificProperties.bind(this);
    }

    render() {
        return (
            <table className='table table-sm table-hover table-striped table-dark'>
                <tbody>
                    <tr>
                        <td className={`${tableScss.key}`}>ID</td>
                        <td>
                            {this.props.node.renderNode.id}
                        </td>
                    </tr>
                    <tr>
                        <td className={`${tableScss.key}`}>Name</td>
                        <td>
                            {this.props.node.sceneNode.name}
                        </td>
                    </tr>
                    <tr>
                        <td className={`${tableScss.key}`}>Type</td>
                        <td>
                            {this.props.node.sceneNode.type}/{this.props.node.renderNode.nodeType}
                        </td>
                    </tr>
                    <tr>
                        <td className={`${tableScss.key}`}>Local Matrix</td>
                        <td>
                            <Matrix4x4 matrix={this.props.node.renderNode.localMatrix} />
                        </td>
                    </tr>
                    <tr>
                        <td className={`${tableScss.key}`}>World Matrix</td>
                        <td>
                            <Matrix4x4 matrix={this.props.node.renderNode.worldMatrix} />
                        </td>
                    </tr>
                    <tr>
                        <td className={`${tableScss.key}`}>Normal Matrix</td>
                        <td>
                            <Matrix3x3 matrix={this.props.node.renderNode.normalMatrix} />
                        </td>
                    </tr>
                    {/* {this._getNodeTypeSpecificProperties()} */}
                </tbody>
            </table>
        );
    }

    _getNodeTypeSpecificProperties() {
        switch (this.props.node.renderNode.nodeType) {
            case RenderNodeType.BASE:
                return <DefaultNodeProperties node={this.props.node} />
            case RenderNodeType.GEOMETRY:
                return <ObjectNodeProperties node={this.props.node} />
            default:
                return <div></div>;
        }
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
}
