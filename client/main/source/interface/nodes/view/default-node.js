import React from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import {SceneNode} from '../../../engine/index'

export class DefaultNode extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const renderNode = new SceneNode();
        this.props.parentRenderNode.addChild(renderNode);

        return (
            <div>
                <FontAwesome name='object-group' />
                <span>{this.props.node.name}</span>
            </div>
        );
    }
}

DefaultNode.propTypes = {
    node: PropTypes.shape({
        name: PropTypes.string.isRequired
    }),
    parentRenderNode: PropTypes.object.isRequired,
}
