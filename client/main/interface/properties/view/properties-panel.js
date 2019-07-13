import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import FontAwesome from 'react-fontawesome';
import {NoNodeSelected} from './no-node-selected';
import {NodeProperties} from './node-properties';

class PropertiesPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='card'>
                <div className='card-header'>
                    <FontAwesome name='search' />
                    <span>Properties</span>
                </div>
                {this.props.selectedNode ? <NodeProperties node={this.props.selectedNode} /> : <NoNodeSelected />}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    selectedNode: state['common.selection'].selectedNode
});

const mapDispatchToProps = () => ({});

export const PropertiesPanelWithData = connect(
    mapStateToProps,
    mapDispatchToProps
)(PropertiesPanel);

PropertiesPanel.propTypes = {
    selectedNode: PropTypes.shape({
        renderNode: PropTypes.shape({
            nodeType: PropTypes.string.isRequired
        })
    })
};
