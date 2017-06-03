import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import FontAwesome from 'react-fontawesome'
import Light from './light'
import LightFormContainer from './light-form-container'
import css from './light-list.scss'

const idBase = 'lights_view_light-list';

export default class LightList extends React.Component {
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
                        <LightFormContainer />
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
