/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React from "react";
import { Link } from 'react-router-dom';

import HeaderLogo from "../../img/darwino-icon32.png";
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

export default class Header extends React.Component {
  onClick() {
    alert("Clicked!");
  }
  render() {
    return (
        // <nav className="navbar navbar-default navbar-fixed-top" role="navigation">
        //   <div className="container-fluid">
        //     <div className="navbar-header">
        //       <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#dwo-header-collapse">
        //         <span className="sr-only">Toggle navigation</span>
        //         <span className="icon-bar"></span>
        //         <span className="icon-bar"></span>
        //         <span className="icon-bar"></span>
        //       </button>
        //       <img src={HeaderLogo} className="navbar-brand hidden-xs" />
        //       <Link to="/" style={{color: 'inherit'}} className="navbar-brand">
        //           Contacts
        //       </Link>
        //     </div>
        //     <div className="collapse navbar-collapse" id="dwo-header-collapse">
        //       <ul className="nav navbar-nav">
        //         <li><a href="#" onClick={this.onClick}>Click me!</a></li>
        //         <li className="dropdown">
        //           <a href="#" className="dropdown-toggle" data-toggle="dropdown">Dropdown<b className="caret"></b></a>
        //             <ul className="dropdown-menu">
        //               <li><a href="#" onClick={this.onClick}>Click me!</a></li>
        //           </ul>
        //         </li>
        //       </ul>
        //     </div>
        //   </div>
        // </nav>
        <Navbar fixedTop collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <img src={HeaderLogo}/>
              <Link to="/" style={{color: 'inherit'}}>
                  Contacts
              </Link>      
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1} href="#">Link</NavItem>
              <NavItem eventKey={2} href="#">Link</NavItem>
              <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
                <MenuItem eventKey={3.1}>Action</MenuItem>
                <MenuItem eventKey={3.2}>Another action</MenuItem>
                <MenuItem eventKey={3.3}>Something else here</MenuItem>
                <MenuItem divider />
              <MenuItem eventKey={3.3}>Separated link</MenuItem>
            </NavDropdown>
          </Nav>
          <Nav pullRight>
            <NavItem eventKey={1} href="#">Link Right</NavItem>
            <NavItem eventKey={2} href="#">Link Right</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}