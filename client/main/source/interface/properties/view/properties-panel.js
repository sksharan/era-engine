import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import FontAwesome from 'react-fontawesome'
// import {Node} from './node'
// import {fetchSceneNodes} from '../action/index'
import {/*RootSceneNode, SceneNodeType*/} from '../../../engine/index'
import {NoNodeSelected} from './no-node-selected'

class PropertiesPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let cardBody = <NoNodeSelected />;

        if (this.props.selectedNode) {
            cardBody = (<span>Node selected</span>);
        }

        return (
            <div className='card'>
                <div className='card-header'>
                    <FontAwesome name='search' />
                    <span>Properties</span>
                </div>
                <div className='card-body'>
                    {cardBody}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    selectedNode: state['common.selection'].selectedNode
});

const mapDispatchToProps = () => ({
});

export const PropertiesPanelWithData = connect(mapStateToProps, mapDispatchToProps)(PropertiesPanel);

PropertiesPanel.propTypes = {
    selectedNode: PropTypes.shape({
        type: PropTypes.string.isRequired
    }),
}
