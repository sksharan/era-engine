import React from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import {graphql} from 'react-apollo'
import {LightRowContainer as LightRow} from './light-row'
import {LightFormContainer as LightForm} from './light-form'
import LightHeader from './light-header'
import FetchLightsQuery from '../query/fetch-lights'
import css from './styles/light-panel.scss'

const idBase = 'lights_view_light-list';

class LightPanel extends React.Component {
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
                <div className={`${css.title} card-header collapsed py-1`} onClick={this.toggleCollapse} data-toggle="collapse" href={`#${idBase}-collapse`}>
                    <div className="mb-0">
                        <FontAwesome name={this.state.collapsed ? 'caret-right' : 'caret-down'} className='align-middle' />
                        <span className='align-middle'> Lights</span>
                    </div>
                </div>
                <div id={`${idBase}-collapse`} className="collapse">
                    <ul className="list-group list-group-flush">
                        <LightForm />
                        <LightHeader />
                        {
                            (this.props.data.loading)
                                ? <div>Loading lights...</div>
                                : this.props.data.light.map((val) => <LightRow key={val.id} light={val} />)
                        }
                    </ul>
                </div>
            </div>
        );
    }

    toggleCollapse() {
        this.setState({collapsed: !this.state.collapsed});
    }
}

LightPanel.propTypes = {
    data: PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        light: PropTypes.array
    })
};

export const LightPanelPresentation = LightPanel;
export const LightPanelContainer = graphql(FetchLightsQuery)(LightPanel);
