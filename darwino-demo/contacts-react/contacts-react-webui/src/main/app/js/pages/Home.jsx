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
              This application has been migrated from a real Notes/Domino application.
            </p>
            <p>
              It is a demo app that aims to show how to map the Notes/Domino UI patterns to
              a pure ReactJS application.<br/>
              Here is what Darwino gives you:
            </p>
            <ul>
              <li>Views: response documents, categorization, dynamic sorting...</li>
              <li>Form: all input types, pickers, subforms, tabs, sections,  embedded views...</li>
              <li>Outlines: collapsible, responsive...</li>
              <li>Well, much more!</li>
            </ul>
            <p>
              All of this is just pure ReactJS. No trick, no proprietary technology to learn. You can integrate any third
              party component, use a different rendering library (boostrap, UI office fabric, Material Design - whatever)
            </p>
            <p>
              <a className="btn btn-primary" target="_blank" href="https://github.com/darwino/darwino-demo/tree/develop/darwino-demo/contacts-react">
                Learn More...
              </a>
            </p>
          </Jumbotron>
        );
  }
}