import React from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import {getFileContentEndpoint} from '../../../../config'
import commonCss from '../../common/scss/table-row-common.scss'

export class FileRow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        // For file download button: https://stackoverflow.com/questions/32207504/correct-way-to-trigger-file-download
        return (
            <tr>
                <td className={`${commonCss.contentItemName}`}>
                    <FontAwesome name='file-o' />
                    {this.props.file.filename}
                </td>
                <td>
                    <form method='get' action={`${getFileContentEndpoint(this.props.file._id)}`}>
                        <button type='submit' className={`btn btn-sm btn-outline-primary ${commonCss.actionButton}`}>
                            <FontAwesome name='download' />
                        </button>
                    </form>
                </td>
            </tr>
        );
    }
}

FileRow.propTypes = {
    file: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        filename: PropTypes.string.isRequired
    })
}
