/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React from "react";
import { Navbar, Nav, NavItem } from 'react-bootstrap';

import {  _t } from '@darwino/darwino';
import {NavLink, NavGroup} from '@darwino/darwino-react-bootstrap';

export default class Navigator extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {expanded, inverse, onSelect} = this.props;
        return (
            <Navbar ref="navbar" expanded={expanded} inverse={inverse} className="navbar-fixed-side" onSelect={onSelect}>
                <Navbar.Collapse>
                    <Nav>
                        <NavLink to="/" exact={true}>Home</NavLink>

                        <NavGroup title={_t("navigator.contacts","Contacts")} collapsible={true} defaultExpanded={true}>
                            <NavLink to="/app/allcontacts">{_t("navigator.allcontacts","All Contacts")}</NavLink>
                            <NavLink to="/app/byauthor">{_t("navigator.byauthor","By Author")}</NavLink>
                            <NavLink to="/app/bystate">{_t("navigator.bystate","By State")}</NavLink>
                            <NavLink to="/app/bydate">{_t("navigator.bydate","By Date")}</NavLink>
                        </NavGroup>

                        <NavGroup title={_t("navigator.companies","Companies")} collapsible={true} defaultExpanded={true}>
                            <NavLink to="/app/allcompanies">{_t("navigator.allcompanies","All Companies")}</NavLink>
                            <NavLink to="/app/allcompaniesbyindustry">{_t("navigator.byindstate","By Industry/State")}</NavLink>
                            <NavLink to="/app/allcompaniesasjson">{_t("navigator.allcompjson","All Companies As JSON")}</NavLink>
                        </NavGroup>

                        <NavGroup title={_t("navigator.tchdemo","Technical Demo")} collapsible={true} defaultExpanded={false}>
                            <NavLink to="/extras/formlayout">{_t("navigator.formlay","Form Layout")}</NavLink>
                            <NavLink to="/extras/allfields">{_t("navigator.allfldtypes","All Field Types")}</NavLink>
                            <NavLink to="/extras/pickers">{_t("navigator.pickers","Pickers")}</NavLink>
                            <NavLink to="/extras/dynamicselect">{_t("navigator.dynselect","Dynamic Selects")}</NavLink>
                            <NavLink to="/extras/services">{_t("navigator.services","Services")}</NavLink>
                            <NavLink to="/extras/code">{_t("navigator.codeexamples","Code Examples")}</NavLink>
                            <NavLink to="/views/allcontacts">{_t("navigator.notescomp","Notes Components")}</NavLink>
                        </NavGroup>

                        <NavGroup title={_t("navigator.mobui","Mobile UI")} defaultExpanded={true}>
                            <li><a  href="../mobile-demo/index.html">{_t("navigator.onsenmob","OnsenUI Mobile")}</a></li>
                        </NavGroup>

                        <NavGroup title={_t("navigator.developers","Developers")}>
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