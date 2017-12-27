import React from 'react'
import PropTypes from 'prop-types'

export class NodeProperties extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
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
                        {renderMatrix(this.props.node.renderNode.localMatrix, 4)}
                    </div>
                </div>
                <div className='row'>
                    <div className={`col-md-${this.props.keyWidth}`}>
                        World Matrix
                    </div>
                    <div className={`col-md-${this.props.valueWidth}`}>
                        {renderMatrix(this.props.node.renderNode.worldMatrix, 4)}
                    </div>
                </div>
                <div className='row'>
                    <div className={`col-md-${this.props.keyWidth}`}>
                        Normal Matrix
                    </div>
                    <div className={`col-md-${this.props.valueWidth}`}>
                        {renderMatrix(this.props.node.renderNode.normalMatrix, 3)}
                    </div>
                </div>
            </div>
        );
    }
}

// Returns JSX code for rendering an n x n matrix
function renderMatrix(matrix, n) {
    let mapped = [];
    for (let i = 0; i < n*n; i++) {
        mapped.push(
            i % n == n-1
            ? <span key={i}>{matrix[i]}<br /></span>
            : <span key={i}>{matrix[i]} </span>
        );
    }
    return mapped;
}

NodeProperties.propTypes = {
    node: PropTypes.shape({
        sceneNode: PropTypes.shape({
            name: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
        }),
        renderNode: PropTypes.shape({
            nodeType: PropTypes.string.isRequired,
            localMatrix: PropTypes.object.isRequired, // Float32Array
            worldMatrix: PropTypes.object.isRequired, // Float32Array
            normalMatrix: PropTypes.object.isRequired, // Float32Array
        }),
    }),
    keyWidth: PropTypes.number.isRequired,
    valueWidth: PropTypes.number.isRequired,
}
