import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import FontAwesome from 'react-fontawesome'
import {Node} from './node'
import {createHierarchyFromNodes} from './hierarchy'
// FIXME: use index file instead of importing directly - it's currently needed
// for the canvas to render correctly
import {fetchSceneNodes} from '../../common/action/node-action'
import {RootSceneNode} from '../../../engine/index'
import css from './scss/node-panel.scss'

class NodePanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='card'>
                <div className='card-header'>
                    <FontAwesome name='sitemap' />
                    <span>Nodes</span>
                </div>
                <div className={`card-body ${css.nodePanelBody}`}>
                    {
                        (this.props.isFetching)
                            ? <div>Loading nodes...</div>
                            : Object.entries(createHierarchyFromNodes(this.props.nodes))
                                    .map(([key, val]) => <Node key={key} val={val} depth={0} parentRenderNode={RootSceneNode} />)
                    }
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.props.getNodes();
    }
}

const mapStateToProps = state => ({
    isFetching: state['common.nodes'].isFetching,
    isError: state['common.nodes'].isError,
    nodes: state['common.nodes'].nodeArray,
})

const mapDispatchToProps = dispatch => ({
    getNodes() {
        dispatch(fetchSceneNodes());
    }
});

export const NodePanelWithData = connect(mapStateToProps, mapDispatchToProps)(NodePanel);

NodePanel.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    isError: PropTypes.bool.isRequired,
    nodes: PropTypes.array,
    getNodes: PropTypes.func.isRequired,
}
