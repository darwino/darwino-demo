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

import { Route, Switch } from 'react-router-dom';
import {  _t } from '@darwino/darwino';
import { MobileUtils } from '@darwino/darwino';
import { AdminConsole, Dialog } from '@darwino/darwino-react-bootstrap';

import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Navigator from "./Navigator.jsx";

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
import AppAllCompaniesAsJson from "./app/AllCompaniesAsJson.jsx";
import AppCompany from "./app/Company.jsx";
import AppCompanyAsJson from "./app/CompanyAsJson.jsx";

import NotesAllContacts from "./app/notes/AllContacts.jsx";
import NotesContact from "./app/notes/Contact.jsx";

import FormLayout from "./app/extras/FormLayout.jsx";
import AllFields from "./app/extras/AllFields.jsx";
import Pickers from "./app/extras/Pickers.jsx";
import DynamicSelect from "./app/extras/DynamicSelect.jsx";
import Code from "./app/extras/Code.jsx";
import Services from "./app/extras/Services.jsx";

export default class Layout extends React.Component {

  constructor(props) {
    super(props)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.state = {sideNavExpanded: false}
  }

  handleSelect() {
        this.setState({sideNavExpanded: false})
  }

  handleToggle() {
      this.setState({sideNavExpanded: !this.state.sideNavExpanded})
  }

  render() {
    const { location, renderingOptions } = this.props;
    return (
      <div>
        <Header inverse={renderingOptions.headerInverted} onToggleNavigator={this.handleToggle} mainPage={this}/>
        <Dialog/>
        <div className="container-fluid" id="body-container">
          <div className="row">
            <div className="col-sm-3 col-lg-2 sidebar">
              <Navigator expanded={this.state.sideNavExpanded} onSelect={this.handleSelect} location={location} inverse={renderingOptions.leftnavInverted}/>
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
                <Route exact path="/app/allcompaniesasjson" component={AppAllCompaniesAsJson}></Route>
                <Route exact path="/app/company/:unid" component={AppCompany}></Route>
                <Route exact path="/app/companyasjson/:unid" component={AppCompanyAsJson}></Route>

                <Route exact path="/views/allcontacts" component={NotesAllContacts}></Route>
                <Route exact path="/forms/contact" component={NotesContact}></Route>
                <Route exact path="/forms/contact/:unid" component={NotesContact}></Route>

                <Route exact path="/extras/formlayout" component={FormLayout}></Route>
                <Route exact path="/extras/allfields" component={AllFields}></Route>
                <Route exact path="/extras/pickers" component={Pickers}></Route>
                <Route exact path="/extras/dynamicselect" component={DynamicSelect}></Route>
                <Route exact path="/extras/code" component={Code}></Route>
                <Route exact path="/extras/services" component={Services}></Route>
                
                <Route exact path="/admin/console" component={AdminConsole}></Route>
              </Switch>
            </div>
          </div>
        </div>
        <div className="hidden-xs">
          <Footer inverse={renderingOptions.footerInverted}/>
        </div>
      </div>
    );
  }
}
