import React from 'react'
import PropTypes from 'prop-types'
import {addObjectWithBoundingBox} from '../../engineop/index'

export class ObjectNode extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        addObjectWithBoundingBox(this.props.node, this.props.parentRenderNode);
        return (
            <div>{this.props.node.name}</div>
        );
    }
}

ObjectNode.propTypes = {
    node: PropTypes.shape({
        name: PropTypes.string.isRequired,
        localMatrix: PropTypes.array.isRequired,
        content: PropTypes.shape({
            positions: PropTypes.array.isRequired,
            normals: PropTypes.array.isRequired,
            texcoords: PropTypes.array.isRequired,
            indices: PropTypes.array.isRequired,
            textureFileId: PropTypes.string.isRequired,
        })
    }),
    parentRenderNode: PropTypes.object.isRequired
}
