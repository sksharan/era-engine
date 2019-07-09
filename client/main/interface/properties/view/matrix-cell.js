import React from 'react';
import PropTypes from 'prop-types';
import scss from '../scss/matrix-cell.scss';

export class MatrixCell extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <span className={`${scss.spacer}`}>{new Number(this.props.val).toFixed(2)}</span>;
    }
}

MatrixCell.propTypes = {
    val: PropTypes.number.isRequired
};
