import React from 'react'
import PropTypes from 'prop-types'
import {createHierarchyFromNodes} from './hierarchy'
import {DefaultNodeWithData} from './default-node'
import {ObjectNodeWithData} from './object-node'
import {RenderNode} from '../../../engine/index'
import {
    ReferenceNodeCache,
    convertSceneNodeToRenderNode,
} from '../../../common/index'

export class Node extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const renderNode = new RenderNode();
        return (
            <div>
                {
                    this.props.val.sceneNodes.map((sceneNode) => {
                        switch (sceneNode.type) {
                            case 'DEFAULT':
                                return <DefaultNodeWithData key={sceneNode._id}
                                                            sceneNode={sceneNode}
                                                            renderNode={convertSceneNodeToRenderNode(sceneNode)}
                                                            parentRenderNode={this.props.parentRenderNode}
                                                            depth={this.props.depth} />
                            case 'OBJECT':
                                return <ObjectNodeWithData key={sceneNode._id}
                                                           sceneNode={sceneNode}
                                                           renderNode={convertSceneNodeToRenderNode(sceneNode)}
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
                    })
                }
                {
                    Object.entries(this.props.val.hierarchy).map(([key, val], index) => {
                        if (index === 0) {
                            this.props.parentRenderNode.addChild(renderNode);
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
