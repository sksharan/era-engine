import React from 'react'
import PropTypes from 'prop-types'

export class FPS extends React.Component {
    render() {
        return <span>{this.props.fps.toFixed(0)} FPS</span>;
    }
}

FPS.propTypes = {
    fps: PropTypes.number.isRequired
};
