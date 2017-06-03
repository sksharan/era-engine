import {connect} from 'react-redux'
import LightList from './light-list'

const mapStateToProps = (state) => {
    return {
        lights: state.lights
    }
};

export default connect(mapStateToProps)(LightList);
