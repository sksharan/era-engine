import React from 'react'
import {UploadFileWithData} from './upload-file'
import {FileTableWithData} from './file-table'

export class Files extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <UploadFileWithData />
                <FileTableWithData />
            </div>
        );
    }
}
