import React from 'react'

export default class FPS extends React.Component {
    render() {
        return <h2>{this.props.fps.toFixed(0)} FPS</h2>;
    }
}
