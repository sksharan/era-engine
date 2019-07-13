import React from 'react';
import PropTypes from 'prop-types';
import {MatrixCell} from './matrix-cell';

export class Matrix4x4 extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='text-nowrap'>
                <MatrixCell val={this.props.matrix[0]} />
                <MatrixCell val={this.props.matrix[4]} />
                <MatrixCell val={this.props.matrix[8]} />
                <MatrixCell val={this.props.matrix[12]} />
                <br />
                <MatrixCell val={this.props.matrix[1]} />
                <MatrixCell val={this.props.matrix[5]} />
                <MatrixCell val={this.props.matrix[9]} />
                <MatrixCell val={this.props.matrix[13]} />
                <br />
                <MatrixCell val={this.props.matrix[2]} />
                <MatrixCell val={this.props.matrix[6]} />
                <MatrixCell val={this.props.matrix[10]} />
                <MatrixCell val={this.props.matrix[14]} />
                <br />
                <MatrixCell val={this.props.matrix[3]} />
                <MatrixCell val={this.props.matrix[7]} />
                <MatrixCell val={this.props.matrix[11]} />
                <MatrixCell val={this.props.matrix[15]} />
            </div>
        );
    }
}

Matrix4x4.propTypes = {
    matrix: PropTypes.object.isRequired // Float32Array
};
