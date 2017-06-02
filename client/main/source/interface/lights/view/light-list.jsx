import React from 'react'
import {connect} from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import FontAwesome from 'react-fontawesome'
import Light from './light'
import LightForm from './light-form'
import css from './light-list.scss'

const idBase = 'lights_view_light-list';

class LightList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true
        };
        this.toggleCollapse = this.toggleCollapse.bind(this);
    }

    render() {
        return (
            <div className='card'>
                <div className={`${css.lightListHeader} card-header collapsed py-1`} onClick={this.toggleCollapse} data-toggle="collapse" href={`#${idBase}-collapse`}>
                    <div className="mb-0">
                        <FontAwesome name={this.state.collapsed ? 'caret-right' : 'caret-down'} className='align-middle' />
                        <span className='align-middle'> Lights</span>
                    </div>
                </div>
                <div id={`${idBase}-collapse`} className="collapse">
                    <ul className="list-group list-group-flush">
                        <LightForm />
                        {this.props.lights.map((val) => <Light key={val.getId()} light={val} />)}
                    </ul>
                </div>
            </div>
        );
    }

    toggleCollapse() {
        this.setState({collapsed: !this.state.collapsed});
    }
}

LightList.propTypes = {
    lights: ImmutablePropTypes.list.isRequired
};

const mapStateToProps = (state) => {
    return {
        lights: state.lights
    }
};

export default connect(mapStateToProps)(LightList);
