/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React from "react";

import { Route, Switch } from 'react-router-dom';

import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Nav from "./Nav.jsx";
import AdminConsole from "../darwino-react-bootstrap/components/AdminConsole.jsx";

import Home from "./Home.jsx";

import AppAllContacts from "./app/AllContacts.jsx";
import AppByAuthor from "./app/ByAuthor.jsx";
import AppByState from "./app/ByState.jsx";
import AppByDate from "./app/ByDate.jsx";

import AppContact from "./app/Contact.jsx";
import AppContacts from "./app/Contacts.jsx";
import AppContactsg from "./app/Contactsg.jsx";

import AppAllCompanies from "./app/AllCompanies.jsx";
import AppAllCompaniesByIndustry from "./app/AllCompaniesByIndustry.jsx";
import AppCompany from "./app/Company.jsx";

export default class Layout extends React.Component {
  render() {
    const { location } = this.props;
    return (
      <div>
        <Header/>
        <div className="container-fluid" id="body-container">
          <div className="row">
            <div className="col-sm-3 col-lg-2 sidebar">
              <Nav location={location} />
            </div>
            <div className="col-sm-9 col-lg-10 main" id="content">
              <Switch>
                <Route exact path="/" component={Home}></Route>

                <Route exact path="/app/allcontacts" component={AppAllContacts}></Route>
                <Route exact path="/app/byauthor" component={AppByAuthor}></Route>
                <Route exact path="/app/bystate" component={AppByState}></Route>
                <Route exact path="/app/bydate" component={AppByDate}></Route>

                <Route exact path="/app/contacts" component={AppContacts}></Route>
                <Route exact path="/app/contactsg" component={AppContactsg}></Route>
                <Route exact path="/app/contact/" component={AppContact}></Route>
                <Route exact path="/app/contact/:unid" component={AppContact}></Route>

                <Route exact path="/app/allcompanies" component={AppAllCompanies}></Route>
                <Route exact path="/app/allcompaniesbyindustry" component={AppAllCompaniesByIndustry}></Route>
                <Route exact path="/app/company/:unid" component={AppCompany}></Route>

                <Route exact path="/admin/console" component={AdminConsole}></Route>
              </Switch>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}
