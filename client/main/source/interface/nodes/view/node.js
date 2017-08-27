import React from 'react'
import PropTypes from 'prop-types'
import {DefaultNode} from './default-node'
import {ObjectNode} from './object-node'

export class Node extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{marginLeft: `${this.props.depth * 30}px`}}>
                {
                    this.props.val.sceneNodes.map((sceneNode) => {
                        switch (sceneNode.type) {
                            case 'DEFAULT':
                                return <DefaultNode key={sceneNode.id} node={sceneNode} />
                            case 'OBJECT':
                                return <ObjectNode key={sceneNode.id} node={sceneNode} />
                            default:
                                return <div>Unknown node type {sceneNode.type}</div>;
                        }
                    })
                }
                {
                    Object.entries(this.props.val.hierarchy).map(([key, val]) => <Node key={key} val={val} depth={this.props.depth + 1} />)
                }
            </div>
        );
    }
}

Node.propTypes = {
    val: PropTypes.object.isRequired,
    depth: PropTypes.number.isRequired,
}
