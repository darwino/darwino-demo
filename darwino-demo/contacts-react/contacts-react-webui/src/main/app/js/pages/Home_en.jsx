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

import React, { Component } from "react";
import { Jumbotron } from "react-bootstrap";
import {  _t } from '@darwino/darwino';

export default class Home_en extends Component {
    render() {
        return (
          <Jumbotron>
            <h1>Darwino Contacts</h1>
            <p>
              Welcome to the Darwino Contacts Demo Application!
              This application is connected to a real Notes/Domino application, with the data
              replicated from the Domino server to the Darwino JSON store. Note that the same
              components can be used to connect straight to the Domino as well.
            </p>
            <p>
              It is a demo app that aims to show how to map the Notes client UI patterns to
              a pure ReactJS application.<br/>
              Here is what the Darwino components provide you, using the Notes vocabulary:
            </p>
            <ul>
              <li>A trully responsive UI -> shrink your browser to see it in action</li>
              <li>Views: response documents, categorization, dynamic sorting, calculation...</li>
              <li>Form: all input types, pickers, subforms, tabs, sections,  embedded views...</li>
              <li>Outlines: page navigation, collapsible...</li>
              <li>Well, much more!</li>
            </ul>
            <p>
              All of this is just pure ReactJS. No trick, no proprietary technology to learn. You can
              integrate any third party component, use a different rendering library (Boostrap, 
              MS UI Office Fabric, Material Design - whatever)
            </p>
            <p>
              <div>
                <a className="btn btn-default" target="_blank" href="https://github.com/darwino/darwino-demo/tree/develop/darwino-demo/contacts-react/contacts-react-webui/src/main/app/js/pages">
                  Navigate to the Client source code...
                </a>
              </div>
              <div>
                <a className="btn btn-default" target="_blank" href="https://github.com/darwino/darwino-demo/blob/develop/darwino-demo/contacts-react/contacts-react-shared/src/main/java/com/contacts/app/microservices/SetCompanySize.java">
                  See how easy it is to write a microservice that updates the database...
                </a>
              </div>
            </p>
          </Jumbotron>
        );
  }
}