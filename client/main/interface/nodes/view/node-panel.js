import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import FontAwesome from 'react-fontawesome';
import {Node} from './node';
import {createHierarchyFromNodes} from './hierarchy';
import {fetchSceneNodes} from '../../common/index';
import {RootSceneNode} from '../../../engine/index';
import {convertSceneNodesToRenderNodes} from '../../../common/index';
import css from './scss/node-panel.scss';

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
                <div className={`${css.nodePanelBody}`}>
                    <table className='table table-sm table-hover table-striped table-dark'>
                        <tbody>
                            {this.props.isFetching ? (
                                <tr>
                                    <td>Loading nodes...</td>
                                </tr>
                            ) : (
                                Object.entries(
                                    createHierarchyFromNodes({
                                        sceneNodes: this.props.nodes,
                                        renderNodes: convertSceneNodesToRenderNodes(this.props.nodes)
                                    })
                                ).map(([key, val]) => {
                                    return (
                                        <tr key={key}>
                                            <td className={`${css.nodePanelItem}`}>
                                                <Node val={val} depth={0} parentRenderNode={RootSceneNode} />
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
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
    nodes: state['common.nodes'].nodeArray
});

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
    getNodes: PropTypes.func.isRequired
};
