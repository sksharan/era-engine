import React from 'react'
import FontAwesome from 'react-fontawesome'
import {graphql, gql} from 'react-apollo'
import {SelectAllQuery} from '../query/scene-node-query'
import css from './styles/node-panel.scss'

const idBase = 'nodeview-node-list';

export class NodePanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false
        };
        this.toggleCollapse = this.toggleCollapse.bind(this);
    }

    render() {
        return (
            <div className='card'>
                <div className={`${css.title} card-header py-1`} onClick={this.toggleCollapse} data-toggle="collapse" href={`#${idBase}-collapse`}>
                    <div className="mb-0">
                        <FontAwesome name={this.state.collapsed ? 'caret-right' : 'caret-down'} className='align-middle' />
                        <span className='align-middle'> Nodes</span>
                    </div>
                </div>
                <div id={`${idBase}-collapse`} className='collapse show'>
                    <ul className="list-group list-group-flush">
                        TODO
                    </ul>
                </div>
            </div>
        );
    }

    toggleCollapse() {
        this.setState({collapsed: !this.state.collapsed});
    }
}

export const NodePanelWithData = graphql(
    gql`${SelectAllQuery}`
)(NodePanel);
