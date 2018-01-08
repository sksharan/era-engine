import React from 'react'
import PropTypes from 'prop-types'
import {createHierarchyFromNodes} from './hierarchy'
import {DefaultNodeWithData} from './default-node'
import {ObjectNodeWithData} from './object-node'
import {
    ReferenceNodeCache,
    convertSceneNodeToRenderNode,
} from '../../../common/index'

export class Node extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const renderNode = convertSceneNodeToRenderNode(this.props.val.sceneNode);
        this.props.parentRenderNode.addChild(renderNode);
        return (
            <div>
                {this._getComponentFromSceneNode(this.props.val.sceneNode, renderNode)}
                {
                    Object.entries(this.props.val.hierarchy).map(([key, val]) => {
                        return <Node key={key} val={val} depth={this.props.depth + 1} parentRenderNode={renderNode} />;
                    })
                }
            </div>
        );
    }

    _getComponentFromSceneNode(sceneNode, renderNode) {
        switch (sceneNode.type) {
            case 'DEFAULT':
                return <DefaultNodeWithData key={sceneNode._id}
                                            sceneNode={sceneNode}
                                            renderNode={renderNode}
                                            parentRenderNode={this.props.parentRenderNode}
                                            depth={this.props.depth} />
            case 'OBJECT':
                return <ObjectNodeWithData key={sceneNode._id}
                                           sceneNode={sceneNode}
                                           renderNode={renderNode}
                                           parentRenderNode={this.props.parentRenderNode}
                                           depth={this.props.depth} />
            case 'REFERENCE':
                return (
                    <div key={sceneNode._id}>
                        {
                            Object.entries(createHierarchyFromNodes(ReferenceNodeCache.getReference({
                                referenceId: sceneNode.content.sceneNodeId
                            })))
                            .map(([key, val]) => <Node key={key}
                                                       val={val}
                                                       depth={this.props.depth}
                                                       parentRenderNode={this.props.parentRenderNode} />)
                        }
                    </div>
                );
            default:
                return <div>Unknown node type {sceneNode.type}</div>;
        }
    }
}

Node.propTypes = {
    val: PropTypes.shape({
        hierarchy: PropTypes.object.isRequired,
        sceneNode: PropTypes.object.isRequired,
        renderNode: PropTypes.object.isRequired,
    }).isRequired,
    depth: PropTypes.number.isRequired,
    parentRenderNode: PropTypes.object.isRequired,
}
