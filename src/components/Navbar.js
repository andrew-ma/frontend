import React from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "../images/logo.svg";

export class Navbar extends React.Component {
    render() {
        const { isLoggedIn } = this.props;

        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <NavLink className="navbar-brand" to="/">
                    <img id="logo" src={logo} alt="AltFlip logo" />
                    <div className="company-name">AltFlip</div>
                </NavLink>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/browse">
                                Browse
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/account">
                                My Assets
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/create">
                                Create
                            </NavLink>
                        </li>
                    </ul>
                    {isLoggedIn ? this._buttonsIfLoggedIn() : this._buttonsIfLoggedOut()}
                </div>
            </nav>
        );
    }

    _buttonsIfLoggedOut = () => {
        // Show Sign in buttons, if we are logged out
        return (
            <Link className="btn btn-outline-success my-2 my-sm-0" to="/sign-in">
                Sign In
            </Link>
        );
    };
    _buttonsIfLoggedIn = () => {
        // Show Sign out buttons, if we are logged in
        return <button className="btn btn-outline-secondary my-2 my-sm-0">Sign Out</button>;
    };
}
