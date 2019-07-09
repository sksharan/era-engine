import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import FontAwesome from 'react-fontawesome';
import {selectNode} from '../../common/index';
import css from './scss/node-common.scss';

class DefaultNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            renderNode: null
        };
        this._triggerNodeSelection = this._triggerNodeSelection.bind(this);
    }

    render() {
        return (
            <div
                style={{paddingLeft: `${this.props.depth * 30}px`}}
                className={
                    this.props.selectedRenderNode && this.props.selectedRenderNode.id === this.props.renderNode.id
                        ? `${css.node} ${css.nodeSelected}`
                        : `${css.node}`
                }
                onClick={this._triggerNodeSelection}
            >
                <FontAwesome name='object-group' />
                <span>{this.props.sceneNode.name}</span>
            </div>
        );
    }

    _triggerNodeSelection() {
        this.props.selectNode(this.props.sceneNode, this.props.renderNode);
    }
}

const mapStateToProps = state => ({
    selectedRenderNode: state['common.selection'].selectedNode
        ? state['common.selection'].selectedNode.renderNode
        : null
});

const mapDispatchToProps = dispatch => ({
    selectNode(sceneNode, renderNode) {
        dispatch(selectNode(sceneNode, renderNode));
    }
});

export const DefaultNodeWithData = connect(
    mapStateToProps,
    mapDispatchToProps
)(DefaultNode);

DefaultNode.propTypes = {
    sceneNode: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    }),
    renderNode: PropTypes.object.isRequired, // TODO define shape
    parentRenderNode: PropTypes.object.isRequired,
    depth: PropTypes.number.isRequired,
    selectNode: PropTypes.func.isRequired,
    selectedRenderNode: PropTypes.object
};
