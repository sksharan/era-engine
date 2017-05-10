'use strict';

const React = require('react');

module.exports = React.createClass({
    render: function() {
        return (<h2>{this.props.fps.toFixed(0)} FPS</h2>);
    }
});
