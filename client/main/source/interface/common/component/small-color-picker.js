// See https://casesandberg.github.io/react-color/#examples

import React from 'react'
import PropTypes from 'prop-types'
import {CustomPicker, SketchPicker} from 'react-color'
import css from './small-color-picker.scss'

class SmallColorPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayColorPicker: false,
            color: {
                r: props.color.r,
                g: props.color.g,
                b: props.color.b,
                a: props.color.a
            }
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleClick() {
        this.setState({displayColorPicker: !this.state.displayColorPicker});
    }

    handleClose() {
        this.setState({displayColorPicker: false});
    }

    handleChange(color) {
        this.setState({color: color.rgb});
        this.props.onChange(color);
    }

    render() {
        const background = `rgba(${this.state.color.r}, ${this.state.color.g}, ${this.state.color.b}, ${this.state.color.a})`;
        return (
            <div className='d-inline-block'>
                <div className={`${css.swatch} align-middle`} onClick={this.handleClick}>
                    <div className={css.color} style={{background: background}} />
                </div>
            {
                this.state.displayColorPicker ?
                <div className={css.popover}>
                    <div className={css.cover} onClick={this.handleClose}/>
                    <SketchPicker color={this.state.color} style={{background: background}} onChange={this.handleChange} />
                </div>
                : null
            }
            </div>
        )
    }
}

SmallColorPicker.propTypes = {
    color: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
}

export default CustomPicker(SmallColorPicker);
