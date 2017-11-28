import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import FontAwesome from 'react-fontawesome'
import {Node} from './node'
import {fetchSceneNodes} from '../action/index'
import {RootSceneNode} from '../../../engine/index'

export class NodePanel extends React.Component {
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
                <div className='card-body'>
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
    isFetching: state.nodePanel.isFetching,
    isError: state.nodePanel.isError,
    nodes: state.nodePanel.nodes
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

/** Returns an object of the form:
 *  {
 *      'a': {
 *          hierarchy: {
 *              'b': {
 *                  hierarchy: {
 *                      ...
 *                  },
 *                  sceneNodes: [...]
 *              },
 *              ...
 *          },
 *          sceneNodes: [...]
 *      },
 *      ...
 *  }
 */
export const createHierarchyFromNodes = (sceneNodes) => {
    const hierarchy = {};
    for (let sceneNode of sceneNodes) {
        addNodeToHierarchy(sceneNode, hierarchy, "/");
    }
    return hierarchy;
}

function addNodeToHierarchy(sceneNode, hierarchy, separator) {
    const pathFragments = sceneNode.path.split(separator);
    let currHierarchy = hierarchy;

    for (let i = 0; i < pathFragments.length; i++) {
        let pathFragment = pathFragments[i];
        if (!currHierarchy[pathFragment]) {
            currHierarchy[pathFragment] = {hierarchy: {}, sceneNodes: []}
        }
        if (i === pathFragments.length - 1) {
            currHierarchy[pathFragment].sceneNodes.push(sceneNode);
        }
        currHierarchy = currHierarchy[pathFragment].hierarchy;
    }
}
