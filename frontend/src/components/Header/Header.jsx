import React from 'react';
import logo from '../../assets/logo.jpg'
import './Header.css'

export const Header = () => {
    return (
        <header className="app-header standard-border">
            <div className="app-header__logo">
                <img src={logo} alt="logo"/>
                <h3 style={{ marginTop: '16px'}}>Nighdee</h3>
            </div>
            <p>Powered by <a href="https://t.me/dmitriybusygin">@dmitriybusygin</a></p>
        </header>
    )
}