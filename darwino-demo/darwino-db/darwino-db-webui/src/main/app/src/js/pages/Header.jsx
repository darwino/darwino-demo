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

import HeaderLogo from "../../img/darwino.png";
import { Navbar, Nav, NavItem } from 'react-bootstrap';

import {  _t } from '@darwino/darwino';
import {  UserService } from '@darwino/darwino';

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

  render() {
    const {currentUser} = this.state;
    return (
      <Navbar id="header" fluid fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <img src={HeaderLogo} alt={_t("header.photo","Photo")} style={{height: 23, marginRight: 10}}/>
            <Link to="/" style={{color: 'inherit'}}>
                Darwino Database
            </Link>
          </Navbar.Brand>
          <Toggle onClick={this.props.onToggleNavigator} className="hidden-md hidden-ld"/>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>      
            <NavItem>
                <img src={currentUser.getPhotoUrl()} alt="" className="img-circle" style={{width: 25, height: 25, marginLeft: 15}}/>
                &nbsp;
                {currentUser.getCn()}
            </NavItem>
          </Nav>      
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
