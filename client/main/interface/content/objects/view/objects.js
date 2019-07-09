import React from 'react';
import {UploadObjectWithData} from './upload-object';
import {ObjectTableWithData} from './object-table';

export class Objects extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <UploadObjectWithData />
                <ObjectTableWithData />
            </div>
        );
    }
}
