import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import FontAwesome from 'react-fontawesome'
import {addObjectWithBoundingBox} from '../../engineop/index'
import {selectSceneNode} from '../../common/index'
import css from './scss/node-common.scss'

class ObjectNode extends React.Component {
    constructor(props) {
        super(props);
        this._triggerNodeSelection = this._triggerNodeSelection.bind(this);
    }

    render() {
        addObjectWithBoundingBox(this.props.node, this.props.parentRenderNode);
        return (
            <div style={{paddingLeft: `${this.props.depth * 30}px`}}
                 className={this.props.selectedNode && this.props.selectedNode._id === this.props.node._id
                     ? `${css.node} ${css.nodeSelected}`
                     : `${css.node}`}
                 onClick={this._triggerNodeSelection}>
                <FontAwesome name='cube' />
                <span>{this.props.node.name}</span>
            </div>
        );
    }

    _triggerNodeSelection() {
        this.props.selectNode(this.props.node);
    }
}

const mapStateToProps = state => ({
    selectedNode: state['common.selection'].selectedNode
})

const mapDispatchToProps = dispatch => ({
    selectNode(node) {
        dispatch(selectSceneNode(node));
    }
});

export const ObjectNodeWithData = connect(mapStateToProps, mapDispatchToProps)(ObjectNode);

ObjectNode.propTypes = {
    node: PropTypes.shape({
        _id: PropTypes.string.isRequired,
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
    parentRenderNode: PropTypes.object.isRequired,
    depth: PropTypes.number.isRequired,
    selectNode: PropTypes.func.isRequired,
    selectedNode: PropTypes.object
}
