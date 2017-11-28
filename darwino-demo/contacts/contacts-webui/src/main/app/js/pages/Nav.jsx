/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc. 2014-2017.
 *
 * Notice: The information contained in the source code for these files is the property 
 * of Darwino Inc. which, with its licensors, if any, owns all the intellectual property 
 * rights, including all copyright rights thereto.  Such information may only be used 
 * for debugging, troubleshooting and informational purposes.  All other uses of this information, 
 * including any production or commercial uses, are prohibited. 
 */

import React from "react";

import NavLink from "../darwino/components/NavLink.jsx";

export default class Nav extends React.Component {
    render() {
        const { location } = this.props;
    
        return (
            <nav className="navbar navbar-default navbar-fixed-side" role="navigation">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" data-target=".navbar-collapse" data-toggle="collapse" className="navbar-toggle">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        </button>
                    </div>
                    <div className="navbar-collapse collapse">
                        <ul className="nav navbar-nav">
                            <NavLink to="/">Home</NavLink>

                            <li className="dropdown">
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown">Documents</a>
                                <ul className="dropdown-menu">
                                    <NavLink to="/app/contacts">Contacts</NavLink>
                                    <NavLink to="/app/contactsg">Contacts Grid</NavLink>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}