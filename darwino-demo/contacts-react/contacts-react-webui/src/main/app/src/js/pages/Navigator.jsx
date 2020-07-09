/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2018.
 *
 * Licensed under The MIT License (https://opensource.org/licenses/MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial 
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React from "react";
import { Navbar, Nav, NavItem } from 'react-bootstrap';

import {  _t } from '@darwino/darwino';
import {NavLink, NavGroup} from '@darwino/darwino-react-bootstrap';

export default class Navigator extends React.Component {
    render() {
        const {expanded, inverse, onSelect} = this.props;
        return (
            <Navbar ref="navbar" expanded={expanded} inverse={inverse} className="navbar-fixed-side" onToggle={onSelect}>
                <Navbar.Collapse>
                    <Nav>
                        <NavLink to="/" exact={true}>{_t("navigator.home","Home")}</NavLink>

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
                            <NavItem href="../mobile-demo/index.html">
                                {_t("navigator.onsenmob","OnsenUI Mobile")}
                            </NavItem>
                        </NavGroup>

                        <NavGroup title={_t("navigator.developers","Developers")}>
                            <NavLink to="/admin/console">Console</NavLink>
                            <NavItem target="_blank" href="https://github.com/darwino/darwino-demo/tree/develop/darwino-demo/contacts-react">
                                Github
                            </NavItem>
                            <NavItem target="_blank" href="https://www.darwino.com">
                                Darwino
                            </NavItem>
                        </NavGroup>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}