import React from 'react'
import PropTypes from 'prop-types'
import {ObjectRowWithData} from './object-row'
import {connect} from 'react-redux'
import {fetchObjects} from '../action/index'
import commonCss from '../../common/scss/table-common.scss'

class ObjectTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={`${commonCss.contentTable}`}>
                <table className='table table-sm table-hover table-striped table-dark'>
                    <tbody>
                    {
                        (this.props.isFetching)
                            ? <tr></tr>
                            : this.props.objectArray.map((e) => <ObjectRowWithData key={e._id} object={e} />)
                    }
                    </tbody>
                </table>
            </div>
        );
    }

    componentDidMount() {
        this.props.getObjects();
    }
}

const mapStateToProps = state => ({
    isFetching: state.contentPanel.objects.isFetching,
    isError: state.contentPanel.objects.isError,
    objectArray: state.contentPanel.objects.objectArray,
})

const mapDispatchToProps = dispatch => ({
    getObjects() {
        dispatch(fetchObjects());
    }
});

export const ObjectTableWithData = connect(mapStateToProps, mapDispatchToProps)(ObjectTable);

ObjectTable.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    isError: PropTypes.bool.isRequired,
    objectArray: PropTypes.array,
    getObjects: PropTypes.func.isRequired,
}
