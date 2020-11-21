import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {fetchObjects} from '../action/index';
import {objectsEndpoint} from '../../../../config';
import commonCss from '../../common/scss/content-upload.scss';

// File upload code derived from https://gist.github.com/AshikNesin/e44b1950f6a24cfcd85330ffc1713513
class UploadObject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null
        };
        this._getFileText = this._getFileText.bind(this);
        this._handleFileChange = this._handleFileChange.bind(this);
        this._onFormSubmit = this._onFormSubmit.bind(this);
    }

    // Other components that rely on the list of objects should re-render
    // FIXME: this is deprecated - https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html
    UNSAFE_componentWillUpdate() {
        this.props.getObjects();
    }

    render() {
        return (
            <form className={`${commonCss.uploadForm}`} onSubmit={this._onFormSubmit}>
                <div className={`custom-file ${commonCss.browseButton}`}>
                    <input type='file' className='custom-file-input' onChange={this._handleFileChange} />
                    <label className='custom-file-label'>{this._getFileText()}</label>
                </div>
                <button type='submit' className={`btn btn-success ${commonCss.uploadButton}`}>
                    Upload
                </button>
            </form>
        );
    }

    _getFileText() {
        return this.state.file ? this.state.file.name : 'Choose file...';
    }

    _handleFileChange(event) {
        this.setState({file: event.target.files[0]});
    }

    _onFormSubmit(event) {
        event.preventDefault(); // Don't submit form and reload page

        if (!this.state.file) {
            return;
        }

        const formData = new FormData();
        formData.append('file', this.state.file);
        formData.append('prefix', '__object_');

        fetch(objectsEndpoint, {
            method: 'POST',
            headers: {
                Accept: 'application/json'
                // NOTE: commenting this line avoids server-side "Error: Multipart: Boundary not found"
                //'Content-Type': 'multipart/form-data',
            },
            body: formData
        }).then(() => {
            this.setState({file: null});
        });
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    getObjects() {
        dispatch(fetchObjects());
    }
});

export const UploadObjectWithData = connect(mapStateToProps, mapDispatchToProps)(UploadObject);

UploadObject.propTypes = {
    getObjects: PropTypes.func.isRequired
};
