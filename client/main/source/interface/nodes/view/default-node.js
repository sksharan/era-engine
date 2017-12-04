import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import FontAwesome from 'react-fontawesome'
import {SceneNode} from '../../../engine/index'
import {selectSceneNode} from '../../common/index'
import css from './scss/node-common.scss'

class DefaultNode extends React.Component {
    constructor(props) {
        super(props);
        this._triggerNodeSelection = this._triggerNodeSelection.bind(this);
    }

    render() {
        const renderNode = new SceneNode();
        this.props.parentRenderNode.addChild(renderNode);

        return (
            <div style={{paddingLeft: `${this.props.depth * 30}px`}}
                 className={this.props.selectedNode && this.props.selectedNode._id === this.props.node._id
                     ? `${css.node} ${css.nodeSelected}`
                     : `${css.node}`}
                 onClick={this._triggerNodeSelection}>
                <FontAwesome name='object-group' />
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

export const DefaultNodeWithData = connect(mapStateToProps, mapDispatchToProps)(DefaultNode);

DefaultNode.propTypes = {
    node: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    }),
    parentRenderNode: PropTypes.object.isRequired,
    depth: PropTypes.number.isRequired,
    selectNode: PropTypes.func.isRequired,
    selectedNode: PropTypes.shape({
        _id: PropTypes.string.isRequired,
    }),
}
