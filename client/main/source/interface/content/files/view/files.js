import React from 'react'
import {FileTableWithData} from './file-table'

export class Files extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <li className='list-group-item'>
                <FileTableWithData />
            </li>
        );
    }
}
