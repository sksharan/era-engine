import React from 'react';
import PropTypes from 'prop-types';
import {MatrixCell} from './matrix-cell';

export class Matrix3x3 extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='text-nowrap'>
                <MatrixCell val={this.props.matrix[0]} />
                <MatrixCell val={this.props.matrix[3]} />
                <MatrixCell val={this.props.matrix[6]} />
                <br />
                <MatrixCell val={this.props.matrix[1]} />
                <MatrixCell val={this.props.matrix[4]} />
                <MatrixCell val={this.props.matrix[7]} />
                <br />
                <MatrixCell val={this.props.matrix[2]} />
                <MatrixCell val={this.props.matrix[5]} />
                <MatrixCell val={this.props.matrix[8]} />
            </div>
        );
    }
}

Matrix3x3.propTypes = {
    matrix: PropTypes.object.isRequired // Float32Array
};
