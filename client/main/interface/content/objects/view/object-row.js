import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import FontAwesome from 'react-fontawesome';
import {sceneNodesEndpoint, refNodePrefix} from '../../../../config';
import {fetchSceneNodes} from '../../../common/index';
import commonCss from '../../common/scss/table-row-common.scss';

class ObjectRow extends React.Component {
    constructor(props) {
        super(props);
        this._updateObjectRefNode = this._updateObjectRefNode.bind(this);
    }

    render() {
        return (
            <tr>
                <td className={`${commonCss.contentItemName}`}>
                    <FontAwesome name='cube' />
                    {this.props.object.name}
                </td>
                <td>
                    <button
                        type='button'
                        className={`btn btn-sm btn-outline-success ${commonCss.actionButton}`}
                        onClick={this._updateObjectRefNode}
                    >
                        <FontAwesome name='plus' />
                    </button>
                </td>
            </tr>
        );
    }

    _updateObjectRefNode() {
        const sceneNodeRefId = this.props.object._id;
        const name = this.props.object.name;
        const refNode = {
            type: 'REFERENCE',
            name,
            // Make the path unique by appending the current time in milliseconds
            path: refNodePrefix + name + new Date().getTime(),
            localMatrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            content: {
                sceneNodeId: sceneNodeRefId
            }
        };
        fetch(sceneNodesEndpoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(refNode)
        })
            .then(response => {
                return Promise.all([response.ok, response.json()]);
            })
            .then(([ok, json]) => {
                if (ok) {
                    this.props.getNodes();
                } else {
                    throw new Error(JSON.stringify(json));
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    getNodes() {
        dispatch(fetchSceneNodes());
    }
});

export const ObjectRowWithData = connect(mapStateToProps, mapDispatchToProps)(ObjectRow);

ObjectRow.propTypes = {
    object: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    }),
    getNodes: PropTypes.func.isRequired
};
