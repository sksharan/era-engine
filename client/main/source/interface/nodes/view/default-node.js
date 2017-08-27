import React from 'react'
import PropTypes from 'prop-types'

export class DefaultNode extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>{this.props.node.name}</div>
        );
    }
}

DefaultNode.propTypes = {
    node: PropTypes.shape({
        name: PropTypes.string.isRequired
    })
}
