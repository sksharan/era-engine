import React from 'react'
import PropTypes from 'prop-types'
import {FileRow} from './file-row'
import {connect} from 'react-redux'
import {fetchMetadataForAllFiles} from '../action/index'
import commonCss from '../../common/scss/table-common.scss'

class FileTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={`${commonCss.contentTable}`}>
                <table className='table table-sm table-hover table-striped table-dark'>
                    <tbody>
                    {
                        (this.props.isFetching)
                            ? <tr></tr>
                            : this.props.fileMetadataArray.map((e) => <FileRow key={e._id} file={e} />)
                    }
                    </tbody>
                </table>
            </div>
        );
    }

    componentDidMount() {
        this.props.getFileMetadata();
    }
}

const mapStateToProps = state => ({
    isFetching: state.contentPanel.files.isFetching,
    isError: state.contentPanel.files.isError,
    fileMetadataArray: state.contentPanel.files.fileMetadataArray
})

const mapDispatchToProps = dispatch => ({
    getFileMetadata() {
        dispatch(fetchMetadataForAllFiles());
    }
});

export const FileTableWithData = connect(mapStateToProps, mapDispatchToProps)(FileTable);

FileTable.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    isError: PropTypes.bool.isRequired,
    fileMetadataArray: PropTypes.array,
    getFileMetadata: PropTypes.func.isRequired,
}
