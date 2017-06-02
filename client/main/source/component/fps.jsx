import React from 'react'
import PropTypes from 'prop-types'

export default class FPS extends React.Component {
    render() {
        return <h2>{this.props.fps.toFixed(0)} FPS</h2>;
    }
}

FPS.propTypes = {
    fps: PropTypes.number.isRequired
};
