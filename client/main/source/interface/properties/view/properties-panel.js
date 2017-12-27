import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import FontAwesome from 'react-fontawesome'
import {NoNodeSelected} from './no-node-selected'
import {NodeProperties} from './node-properties'
import {DefaultNodeProperties} from './default-node-properties'
import {ObjectNodeProperties} from './object-node-properties'
import {SceneNodeType} from '../../engineop/index'

class PropertiesPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let cardBody = <NoNodeSelected />;

        if (this.props.selectedNode) {
            switch (this.props.selectedNode.renderNode.nodeType) {
                case SceneNodeType.BASE:
                    cardBody = (
                        <div>
                            <NodeProperties node={this.props.selectedNode} keyWidth={4} valueWidth={8} />
                            <DefaultNodeProperties node={this.props.selectedNode} keyWidth={4} valueWidth={8} />
                        </div>
                    );
                    break;
                case SceneNodeType.GEOMETRY:
                    cardBody = (
                        <div>
                            <NodeProperties node={this.props.selectedNode} keyWidth={4} valueWidth={8} />
                            <ObjectNodeProperties node={this.props.selectedNode} keyWidth={4} valueWidth={8} />
                        </div>
                    );
                    break;
                default:
                    console.warn(`Unknown selected node type: ${this.props.selectedNode.renderNode.nodeType}`);
                    cardBody = (<span>Node selected</span>);
                    break;
            }
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
        renderNode: PropTypes.shape({
            nodeType: PropTypes.string.isRequired,
        }),
    }),
}
