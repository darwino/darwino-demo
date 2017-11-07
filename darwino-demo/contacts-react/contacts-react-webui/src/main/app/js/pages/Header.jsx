/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React from "react";
import { Link } from 'react-router-dom';

//import HeaderLogo from "../../img/darwino-icon32-blue.png";
import HeaderLogo from "../../img/darwino-icon32-white.png";
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

import { UserService } from '@darwino/darwino';

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
        <span className="sr-only">Toggle navigation</span>
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
      <Navbar id="header" inverse={this.props.inverse} fluid fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <img src={HeaderLogo} alt="Photo" style={{height: 23, marginRight: 10}}/>
            <Link to="/" style={{color: 'inherit'}}>
                Contacts
            </Link>
          </Navbar.Brand>
          <Toggle onClick={this.props.onToggleNavigator}/>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>      
            <Navbar.Text>
              <img src={currentUser.getPhotoUrl()} className="img-circle" style={{width: 25, height: 25}}/>
              &nbsp;
              {currentUser.getCn()}
            </Navbar.Text>
          </Nav>      
        </Navbar.Collapse>
      </Navbar>
    );
  }
}