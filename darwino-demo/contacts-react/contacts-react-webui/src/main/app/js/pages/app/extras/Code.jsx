/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form';
import { Tabs, Tab, Button, ButtonToolbar, ControlLabel } from 'react-bootstrap';

import { JstoreCursor, Jsql } from '@darwino/darwino';
import { DocumentForm, Dialog, Messages, renderText, ListPicker } from '@darwino/darwino-react-bootstrap';

import Constants from "../Constants.jsx";

import CodeDatabaseAccess from "./CodeDatabaseAccess.jsx";
import CodeDialogs from "./CodeDialogs.jsx";
import CodeMessages from "./CodeMessages.jsx";

const FORM_NAME = "code";

//
// Demo page showing the different pickers
//
class Code extends DocumentForm {

    constructor(props,context) {
        super(props,context)
    }

    render() {
        return (
            <div>
                {this.createMessages()}
                <form>
                    <h2>Some code examples</h2>
                    <Tabs defaultActiveKey={1} id="doctab">
                        <Tab eventKey={1} title="Database access">
                            <CodeDatabaseAccess mainForm={this}/>
                        </Tab>
                        <Tab eventKey={2} title="Prompt Dialogs">
                            <CodeDialogs mainForm={this}/>
                        </Tab>
                        <Tab eventKey={3} title="Messages">
                            <CodeMessages mainForm={this}/>
                        </Tab>
                    </Tabs>
                    {/*Uncomment to display the current JSON content*/}
                    {/* <JsonDebug form={this.props.form}/>   */}
                </form>
            </div>
        );
    }
}

const form = reduxForm({
    form: FORM_NAME,
    validate: DocumentForm.validateForm,
    onChange: DocumentForm.onChange
});

export default withRouter(
    connect(null,DocumentForm.mapDispatchToProps)
        (form(Code))
)
