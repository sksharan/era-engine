import React from 'react'
import PropTypes from 'prop-types'
import {DefaultNode} from './default-node'
import {ObjectNode} from './object-node'
import {
    generateRenderNode,
    addChildToRenderNode,
} from '../../engineop/index'

export class Node extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const renderNode = generateRenderNode();
        return (
            <div style={{marginLeft: `${this.props.depth * 30}px`}}>
                {
                    this.props.val.sceneNodes.map((sceneNode) => {
                        switch (sceneNode.type) {
                            case 'DEFAULT':
                                return <DefaultNode key={sceneNode._id} node={sceneNode} parentRenderNode={this.props.parentRenderNode} />
                            case 'OBJECT':
                                return <ObjectNode key={sceneNode._id} node={sceneNode} parentRenderNode={this.props.parentRenderNode} />
                            default:
                                return <div>Unknown node type {sceneNode.type}</div>;
                        }
                    })
                }
                {
                    Object.entries(this.props.val.hierarchy).map(([key, val], index) => {
                        if (index === 0) {
                            addChildToRenderNode(renderNode, this.props.parentRenderNode);
                        }
                        return <Node key={key} val={val} depth={this.props.depth + 1} parentRenderNode={renderNode} />;
                    })
                }
            </div>
        );
    }
}

Node.propTypes = {
    val: PropTypes.object.isRequired,
    depth: PropTypes.number.isRequired,
    parentRenderNode: PropTypes.object.isRequired,
}
