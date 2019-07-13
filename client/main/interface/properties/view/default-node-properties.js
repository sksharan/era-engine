import React from 'react';
import tableScss from '../scss/table.scss';

export class DefaultNodeProperties extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <tr>
                <td className={`${tableScss.key}`}>TODO</td>
                <td>Default</td>
            </tr>
        );
    }
}
