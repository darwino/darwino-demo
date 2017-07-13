/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2017.
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

import React from "react";

import { Route, Switch } from 'react-router-dom';

import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Nav from "./Nav.jsx";

import Home from "./Home.jsx";

import AppAllContacts from "./app/AllContacts.jsx";
import AppByAuthor from "./app/ByAuthor.jsx";
import AppByState from "./app/ByState.jsx";
import AppByDate from "./app/ByDate.jsx";

import AppContact from "./app/Contact.jsx";
import AppContacts from "./app/Contacts.jsx";
import AppContactsg from "./app/Contactsg.jsx";

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
              </Switch>
            </div>
          </div>
        </div>
        <Footer/>
      </div>

    );
  }
}
