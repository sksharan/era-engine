import React from 'react'
import PropTypes from 'prop-types'
import {SceneNode} from '../../../engine/index'

export class DefaultNode extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const renderNode = new SceneNode();
        this.props.parentRenderNode.addChild(renderNode);

        return (
            <div>{this.props.node.name}</div>
        );
    }
}

DefaultNode.propTypes = {
    node: PropTypes.shape({
        name: PropTypes.string.isRequired
    }),
    parentRenderNode: PropTypes.object.isRequired,
}
