import React from 'react'
import PropTypes from 'prop-types'

export class Node extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>{this.props.node.name}</div>
        );
    }
}

Node.propTypes = {
    node: PropTypes.shape({
        name: PropTypes.string.isRequired
    })
}
