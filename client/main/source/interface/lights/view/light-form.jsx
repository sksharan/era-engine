import React from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import css from './light-form.scss'

export default class LightForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ''
        };
        this.handleNameChange = this.handleNameChange.bind(this);
        this.createLight = this.createLight.bind(this);
    }

    handleNameChange(event) {
        this.setState({name: event.target.value});
    }

    createLight() {
        this.props.createLight(this.state.name);
    }

    render() {
        return (
            <li className={`${css.lightForm} list-group-item p-1`}>
                <input className="form-control form-control-sm" type="text" placeholder="Name" value={this.state.name} onChange={this.handleNameChange} />
                <span>&nbsp;</span>
                <button type='button' className='btn btn-success btn-sm' onClick={this.createLight}>
                    <FontAwesome name='plus' className='align-middle' />
                </button>
            </li>
        );
    }
}

LightForm.propTypes = {
    createLight: PropTypes.func.isRequired
}
