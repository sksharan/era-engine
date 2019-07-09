import React from 'react';
import tableScss from '../scss/table.scss';

export class ObjectNodeProperties extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <tr>
                <td className={`${tableScss.key}`}>TODO</td>
                <td>Object</td>
            </tr>
        );
    }
}
