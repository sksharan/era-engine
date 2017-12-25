import React from 'react'
import {FileTableWithData} from './file-table'

export class Files extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <FileTableWithData />
            </div>
        );
    }
}
