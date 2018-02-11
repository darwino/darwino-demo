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

import { UserService, MicroServices } from '@darwino/darwino';

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

  setLocale(locale) {
    new MicroServices()
        .name("SetSessionLocale")
        .params({locale})
        .fetch()
        .then((r) => {
            // Ok, just refresh the main page?                
            this.props.mainPage.forceUpdate();
        })
        .catch((e) => {
            alert("Error while setting the locale\n"+e.toString());
        })
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
          <Toggle onClick={this.props.onToggleNavigator} className="hidden-md hidden-ld"/>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>      
            <Navbar.Text>
                <img src={LangDEF} onClick={() => this.setLocale(null)} alt="Default Language" style={{height: 18, marginRight: 3}}/>
                <img src={LangEN} onClick={() => this.setLocale("en")} alt="Language English" style={{height: 18, marginRight: 3}}/>
                <img src={LangFR} onClick={() => this.setLocale("fr")} alt="Language French" style={{height: 18, marginRight: 3}}/>
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