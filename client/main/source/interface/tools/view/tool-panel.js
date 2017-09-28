import React from 'react'
import FontAwesome from 'react-fontawesome'
import {
    togglePointerLock,
    setTranslate,
    setScale,
    setRotate,
} from '../../engineop/index'

export class ToolPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='card'>
                <div className='card-header'>
                    <FontAwesome name='wrench' />
                    <span className='align-middle'>Tools</span>
                </div>
                <div className='card-header'>
                    <div className='row'>
                        <div className='col'>
                            <strong>Camera</strong>
                        </div>
                        <div className='col'>
                            <strong>Transform</strong>
                        </div>
                        <div className='col'>
                            <strong>Debug</strong>
                        </div>
                    </div>
                </div>
                <div className='card-body'>
                    <div className='row'>
                        <div className='col'>
                            <button type='button' className='btn btn-sm btn-outline-light' onClick={togglePointerLock}>
                                <FontAwesome name='video-camera' />
                            </button>
                        </div>
                        <div className='col'>
                            <button type='button' className='btn btn-sm btn-outline-light' onClick={setTranslate}>
                                <FontAwesome name='arrows' />
                            </button>
                            <button type='button' className='btn btn-sm btn-outline-light' onClick={setScale}>
                                <FontAwesome name='arrows-alt' />
                            </button>
                            <button type='button' className='btn btn-sm btn-outline-light' onClick={setRotate}>
                                <FontAwesome name='refresh' />
                            </button>
                        </div>
                        <div className='col'>
                            <button type='button' className='btn btn-sm btn-outline-light'>
                                <span>FPS</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
