/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React from "react";
import { Navbar, Nav, NavItem } from 'react-bootstrap';

import {NavLink, NavGroup} from '@darwino/darwino-react-bootstrap';

export default class Navigator extends React.Component {
    render() {
        return (
            <Navbar inverse={this.props.inverse} collapseOnSelect className="navbar-fixed-side">
                <Navbar.Header>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
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

                        <NavGroup title="Technical Demo" collapsible={true} defaultExpanded={false}>
                            <NavLink to="/extras/formlayout">Form Layout</NavLink>
                            <NavLink to="/extras/allfields">All Field Types</NavLink>
                            <NavLink to="/extras/pickers">Pickers</NavLink>
                            <NavLink to="/extras/dynamicselect">Dynamic Selects</NavLink>
                            <NavLink to="/extras/services">Services</NavLink>
                            <NavLink to="/extras/code">Code Examples</NavLink>
                            <NavLink to="/views/allcontacts">Notes Components</NavLink>
                        </NavGroup>

                        <NavGroup title="Developers">
                            <NavLink to="/admin/console">Console</NavLink>
                            <li><a target="_blank" href="https://github.com/darwino/darwino-demo/tree/develop/darwino-demo/contacts-react">Github</a></li>
                            <li><a target="_blank" href="https://www.darwino.com">Darwino</a></li>
                        </NavGroup>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}