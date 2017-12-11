import React from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import commonCss from '../../common/scss/table-row-common.scss'

export class ObjectRow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <tr>
                <td className={`${commonCss.contentItemName}`}>
                    <FontAwesome name='cube' />
                    {this.props.object.name}
                </td>
                <td>
                    <button type='button' className={`btn btn-sm btn-outline-success ${commonCss.actionButton}`}>
                        <FontAwesome name='plus' />
                    </button>
                </td>
            </tr>
        );
    }
}

ObjectRow.propTypes = {
    object: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }),
}
