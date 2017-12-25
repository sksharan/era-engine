import React from 'react'
import FontAwesome from 'react-fontawesome'
import {Objects} from '../../objects/index'
import {Files} from '../../files/index'

export class ContentPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'OBJECTS'
        }
        this._showSelectedTabContents = this._showSelectedTabContents.bind(this);
    }

    render() {
        return (
            <div className='card'>
                <div className='card-header'>
                    <FontAwesome name='database' />
                    <span>Content Repository</span>
                </div>
                <ul className='nav nav-tabs'>
                    <li className='nav-item' onClick={() => this.setState({selectedTab: 'OBJECTS'})}>
                        <a className={`nav-link ${this.state.selectedTab === 'OBJECTS' ? 'active' : ''}`} href="#">
                            <FontAwesome name='cubes' />
                            Objects
                        </a>
                    </li>
                    <li className='nav-item' onClick={() => this.setState({selectedTab: 'FILES'})}>
                        <a className={`nav-link ${this.state.selectedTab === 'FILES' ? 'active' : ''}`} href="#">
                            <FontAwesome name='files-o' />
                            Files
                        </a>
                    </li>
                </ul>
                {this._showSelectedTabContents()}
            </div>
        );
    }

    _showSelectedTabContents() {
        switch (this.state.selectedTab) {
            case 'OBJECTS':
                return <Objects />;
            case 'FILES':
                return <Files />;
            default:
                console.warn(`Unknown tab selected: ${this.state.selectedTab}`);
        }
    }
}
