import React from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import css from './scss/object-row.scss'

export class ObjectRow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <tr>
                <td className={`${css.object}`}>
                    <FontAwesome name='cube' />
                    {this.props.object.name}
                </td>
                <td></td>
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
