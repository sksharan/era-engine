import React from 'react'
import FontAwesome from 'react-fontawesome'
import {Objects} from '../../objects/index'
import {Files} from '../../files/index'

export class ContentPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='card'>
                <div className='card-header'>
                    <FontAwesome name='cubes' />
                    <span>Content Repository</span>
                </div>
                <ul className='list-group'>
                    <Objects />
                    <Files />
                </ul>
            </div>
        );
    }
}
