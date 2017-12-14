import React from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import {sceneNodesEndpoint, refNodePrefix} from '../../../../config'
import {
    ReferenceNodeEngineCache,
    ReferenceNodeExternalCache,
    convertToRenderRefNode
,} from '../../../engineop/index'
import commonCss from '../../common/scss/table-row-common.scss'

export class ObjectRow extends React.Component {
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
                    <button type='button' className={`btn btn-sm btn-outline-success ${commonCss.actionButton}`}
                            onClick={this._updateObjectRefNode}>
                        <FontAwesome name='plus' />
                    </button>
                </td>
            </tr>
        );
    }

    _updateObjectRefNode() {
        const sceneNodeRefId = this.props.object._id;
        const name = this.props.object.name;
        const path = '';
        const refNode = {
            type: 'REFERENCE',
            name,
            path: refNodePrefix + path,
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
                ReferenceNodeEngineCache.updateReference({
                    referenceId: sceneNodeRefId,
                    data: [convertToRenderRefNode(json)]
                });
                ReferenceNodeExternalCache.updateReference({
                    referenceId: sceneNodeRefId,
                    data: [json]
                });
            } else {
                console.error(json);
            }
        })
        .catch(error => {
            console.error(error);
        });
    }
}

ObjectRow.propTypes = {
    object: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }),
}
