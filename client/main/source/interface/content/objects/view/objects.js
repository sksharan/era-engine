import React from 'react'
import {UploadObject} from './upload-object'
import {ObjectList} from './object-list'

export class Objects extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <li className='list-group-item'>
                <UploadObject />
                <ObjectList />
            </li>
        );
    }
}
