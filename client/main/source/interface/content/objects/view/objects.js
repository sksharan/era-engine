import React from 'react'
import {UploadObject} from './upload-object'
import {ObjectTableWithData} from './object-table'

export class Objects extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <li className='list-group-item'>
                <UploadObject />
                <ObjectTableWithData />
            </li>
        );
    }
}
