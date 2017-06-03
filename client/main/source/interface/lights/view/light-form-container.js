import {connect} from 'react-redux'
import LightForm from './light-form'
import {createLight} from '../actions'

const mapDispatchToProps = (dispatch) => {
    return {
        createLight: (name) => {
            dispatch(createLight(name, 'POINT'));
        }
    }
};

export default connect(null, mapDispatchToProps)(LightForm);
