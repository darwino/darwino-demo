/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React, { Component } from "react";
import { Jumbotron } from "react-bootstrap";

export default class Home extends Component {
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