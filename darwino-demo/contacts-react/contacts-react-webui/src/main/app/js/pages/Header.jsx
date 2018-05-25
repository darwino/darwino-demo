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
import { Link } from 'react-router-dom';

//import HeaderLogo from "../../img/darwino-icon32-blue.png";
import HeaderLogo from "../../img/darwino-icon32-white.png";
import LangDEF from "../../img/default24.png";
import LangEN from "../../img/english24.png";
import LangFR from "../../img/french24.png";
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

import {  _t } from '@darwino/darwino';
import { I18N, UserService, MicroServices } from '@darwino/darwino';

class Toggle extends React.Component {
  render() {
    const { onClick } = this.props;
    const buttonProps = {
      type: 'button',
      onClick,
      className: 'navbar-toggle' // collapsed
    };

    return (
      <button {...buttonProps}>
        <span className="sr-only">{_t("header.toggle","Toggle navigation")}</span>
        <span className="icon-bar" />
        <span className="icon-bar" />
        <span className="icon-bar" />
      </button>
    );
  }
}
export default class Header extends React.Component {
  
  constructor(props) {
    super(props)
    const userService = new UserService()
    this.state = {
      currentUser: userService.getCurrentUser((u,loaded)=>{
        if(loaded) {this.setState({currentUser: u})}
      })
    }
  }

  setLocale(locale) {
    new MicroServices()
        .name("SetSessionLocale")
        .params({locale})
        .fetch()
        .then((r) => {
            I18N.setLocale(r.locale);
        })
        .catch((e) => {
            alert(_t("header.errsetloc","Error while setting the locale\n")+e.toString());
        })
  }

  currentLocaleImage() {
      const locale = I18N.getLocale();
      switch(locale) {
          case "en":    return LangEN;
          case "fr":    return LangFR;
      }
      return null;
  }

  render() {
    const {currentUser} = this.state;
    return (
      <Navbar id="header" inverse={this.props.inverse} fluid fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <img src={HeaderLogo} alt={_t("header.photo","Photo")} style={{height: 23, marginRight: 10}}/>
            <Link to="/" style={{color: 'inherit'}}>
                Contacts
            </Link>
          </Navbar.Brand>
          <Toggle onClick={this.props.onToggleNavigator} className="hidden-md hidden-ld"/>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>      
            <NavDropdown 
                eventKey="3"
                title={_t("header.language","Language")}
                >
                <MenuItem eventKey="3.1" onClick={() => this.setLocale(null)} >
                    <img src={LangDEF} alt={_t("header.langdef","Default Language")} style={{height: 18, marginRight: 3}}/>
                    {_t("header.browserdef","Browser Default")}
                </MenuItem>
                <MenuItem eventKey="3.2" onClick={() => this.setLocale("en")} >
                    <img src={LangEN} alt={_t("header.langenglish","Language English")} style={{height: 18, marginRight: 3}}/>
                    {_t("header.english","English")}
                </MenuItem>
                <MenuItem eventKey="3.3" onClick={() => this.setLocale("fr")} >
                    <img src={LangFR} alt={_t("header.langfrench","Language French")} style={{height: 18, marginRight: 3}}/>
                    {_t("header.french","French")}
                </MenuItem>
            </NavDropdown >                
            <Navbar.Text>
                <img src={this.currentLocaleImage()} alt={_t("header.currentlang","Current Language")} style={{height: 18, marginRight: 3}}/>
            </Navbar.Text>
            <Navbar.Text>
                <img src={currentUser.getPhotoUrl()} className="img-circle" style={{width: 25, height: 25, marginLeft: 15}}/>
                &nbsp;
                {currentUser.getCn()}
            </Navbar.Text>
          </Nav>      
        </Navbar.Collapse>
      </Navbar>
    );
  }
}