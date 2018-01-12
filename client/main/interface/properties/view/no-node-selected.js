import React from 'react'
import tableScss from '../scss/table.scss'

export class NoNodeSelected extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <table className='table table-sm table-hover table-striped table-dark'>
                <tbody>
                    <tr>
                        <td className={`${tableScss.key}`}>No node selected</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
