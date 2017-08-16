/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React from "react";

import NavLink from "../darwino-react-bootstrap/components/NavLink.jsx";
import NavGroup from "../darwino-react-bootstrap/components/NavGroup.jsx";

export default class Nav extends React.Component {
    render() {
        const { location } = this.props;
    
        return (
            <nav className="navbar navbar-default navbar-fixed-side" role="navigation">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" data-target="#dwo-nav-collapse" data-toggle="collapse" className="navbar-toggle">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        </button>
                    </div>
                    <div className="navbar-collapse collapse" id="dwo-nav-collapse">
                        <ul className="nav navbar-nav">
                            <NavLink to="/" exact={true}>Home</NavLink>

                            <NavGroup title="Contacts" collapsible={true} defaultExpanded={true}>
                                <NavLink to="/app/allcontacts">All Contacts</NavLink>
                                <NavLink to="/app/byauthor">By Author</NavLink>
                                <NavLink to="/app/bystate">By State</NavLink>
                                <NavLink to="/app/bydate">By Date</NavLink>
                            </NavGroup>

                            <NavGroup title="Companies" collapsible={true} defaultExpanded={true}>
                                <NavLink to="/app/allcompanies">All Companies</NavLink>
                                <NavLink to="/app/allcompaniesbyindustry">By Industry/State</NavLink>
                            </NavGroup>

                            <NavGroup title="Developers">
                                <NavLink to="/admin/console">Console</NavLink>
                                <li><a target="_blank" href="https://github.com/darwino/darwino-demo/tree/develop/darwino-demo/contacts-react">Github</a></li>
                            </NavGroup>
                            
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}