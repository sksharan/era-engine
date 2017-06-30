import React from 'react'
import css from './styles/light-header.scss'

export default class LightHeader extends React.Component {
    render() {
        return (
            <li className={`list-group-item list-group-item-action flex-column align-items-start ${css.header}`}>
                <div className="d-flex w-100 justify-content-between">
                    <div className={`${css.item}`}><strong>Type</strong></div>
                    <div className={`${css.item}`}><strong>Name</strong></div>
                    <div className={`${css.item}`}><strong>Ambient</strong></div>
                    <div className={`${css.item}`}><strong>Diffuse</strong></div>
                    <div className={`${css.item}`}><strong>Specular</strong></div>
                    <div className={`${css.item}`}><strong>Action</strong></div>
                </div>
            </li>
        );
    }
}
