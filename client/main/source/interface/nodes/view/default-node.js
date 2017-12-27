import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import FontAwesome from 'react-fontawesome'
import {SceneNode} from '../../../engine/index'
import {selectNode} from '../../common/index'
import css from './scss/node-common.scss'

class DefaultNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            renderNode: null,
        }
        this._triggerNodeSelection = this._triggerNodeSelection.bind(this);
    }

    render() {
        return (
            <div style={{paddingLeft: `${this.props.depth * 30}px`}}
                 className={this.props.selectedSceneNode && this.props.selectedSceneNode._id === this.props.node._id
                     ? `${css.node} ${css.nodeSelected}`
                     : `${css.node}`}
                 onClick={this._triggerNodeSelection}>
                <FontAwesome name='object-group' />
                <span>{this.props.node.name}</span>
            </div>
        );
    }

    componentDidMount() {
        this.setState({
            renderNode: new SceneNode()
        },
        () => {
            this.props.parentRenderNode.addChild(this.state.renderNode);
        })
    }

    _triggerNodeSelection() {
        this.props.selectNode(this.props.node, this.state.renderNode);
    }
}

const mapStateToProps = state => ({
    selectedSceneNode: state['common.selection'].selectedNode
        ? state['common.selection'].selectedNode.sceneNode
        : null
});

const mapDispatchToProps = dispatch => ({
    selectNode(sceneNode, renderNode) {
        dispatch(selectNode(sceneNode, renderNode));
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
    selectedSceneNode: PropTypes.shape({
        _id: PropTypes.string.isRequired,
    }),
}
