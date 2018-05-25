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
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form';
import { Tabs, Tab, Button, ButtonToolbar, ControlLabel } from 'react-bootstrap';

import { JstoreCursor, Jsql } from '@darwino/darwino';
import {  _t } from '@darwino/darwino';
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
                        <Tab eventKey={1} title={_t("code.dbaccess","Database access")}>
                            <CodeDatabaseAccess mainForm={this}/>
                        </Tab>
                        <Tab eventKey={2} title={_t("code.dialogs","Prompt Dialogs")}>
                            <CodeDialogs mainForm={this}/>
                        </Tab>
                        <Tab eventKey={3} title={_t("code.messages","Messages")}>
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
