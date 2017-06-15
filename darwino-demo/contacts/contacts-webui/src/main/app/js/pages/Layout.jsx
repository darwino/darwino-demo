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

import { Route, Switch, Link } from 'react-router-dom';

import Footer from "./Footer.jsx";
import Nav from "./Nav.jsx";

import Home from "./Home.jsx";

import AppContact from "./app/Contact.jsx";
import AppContacts from "./app/Contacts.jsx";
import AppContactsg from "./app/Contactsg.jsx";

import HeaderLogo from "../../img/darwino-icon32.png";

export default class Layout extends React.Component {
  render() {
    const { location } = this.props;
    return (
      <div>

        <nav className="navbar navbar-default navbar-fixed-top" role="navigation">
          <div className="container-fluid">
            <div className="navbar-header">
              <Link to="/" style={{color: 'inherit'}} className="navbar-brand">
                <img src={HeaderLogo} className="hidden-sm hidden-xs" />
                Welcome to the Contacts application
              </Link>
            </div>
          </div>
        </nav>

        <div className="container-fluid" id="body-container">
          <div className="row">
            <div className="col-sm-3 col-lg-2 sidebar">
              <Nav location={location} />
            </div>
            <div className="col-sm-9 col-lg-10 main" id="content">
              <Switch>
                <Route exact path="/" component={Home}></Route>

                <Route exact path="/app/contacts" component={AppContacts}></Route>
                <Route exact path="/app/contactsg" component={AppContactsg}></Route>
                <Route exact path="/app/contact/" component={AppContact}></Route>
                <Route exact path="/app/contact/:unid" component={AppContact}></Route>
              </Switch>
            </div>
          </div>
          <Footer/>
        </div>
      </div>

    );
  }
}
