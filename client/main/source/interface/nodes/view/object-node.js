import React from 'react'
import PropTypes from 'prop-types'
import {mat4} from 'gl-matrix'
import {
    GeometryNode,
    Mesh,
    BoundingBox,
    ProgramBuilder,
    Material
} from '../../../engine/index'
import {filesEndpoint} from '../../../config'

const programData = new ProgramBuilder()
        .addPosition()
        .addNormal()
        .addTexcoord()
        .build();

export class ObjectNode extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const mesh = new Mesh({
            positions: this.props.node.content.positions,
            normals: this.props.node.content.normals,
            texcoords: this.props.node.content.texcoords,
            numVertices: this.props.node.content.positions.length,
            indices: this.props.node.content.indices
        });

        const material = new Material({
            programData,
            imageSrc: `${filesEndpoint}/${this.props.node.content.textureFileId}/content`
        });

        const obb = new GeometryNode(localMatrix, {
            mesh: new BoundingBox(this.props.node.content.positions),
            material
        });

        const localMatrix = mat4.create();
        const renderNode = new GeometryNode(localMatrix, {mesh, material});
        this.props.parentRenderNode.addChild(renderNode);
        renderNode.addChild(obb);

        return (
            <div>{this.props.node.name}</div>
        );
    }
}

ObjectNode.propTypes = {
    node: PropTypes.shape({
        name: PropTypes.string.isRequired,
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
