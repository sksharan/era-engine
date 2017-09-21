import React from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'react-apollo'
import {SelectAllQuery} from '../query/scene-node-query'
import {Node} from './node'
import {RootSceneNode} from '../../../engine/index'
import css from './styles/node-panel.scss'

export class NodePanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='card'>
                <div className={`${css.title} card-header py-1`}>
                    <div className="mb-0">
                        <span className='align-middle'>Nodes</span>
                    </div>
                </div>
                <div className='collapse show'>
                    <ul className="list-group list-group-flush">
                        {
                            (this.props.data.loading)
                                ? <div>Loading nodes...</div>
                                : Object.entries(createHierarchyFromNodes(this.props.data.sceneNodes))
                                        .map(([key, val]) => <Node key={key} val={val} depth={0} parentRenderNode={RootSceneNode} />)
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

export const NodePanelWithData = graphql(SelectAllQuery)(NodePanel);

NodePanel.propTypes = {
    data: PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        sceneNodes: PropTypes.array
    })
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
