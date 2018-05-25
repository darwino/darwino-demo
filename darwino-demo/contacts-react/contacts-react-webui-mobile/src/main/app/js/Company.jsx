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

import React, {Component} from "react";
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form';
import {
    Page,
    List,
    Toolbar
} from 'react-onsenui';

import { UserService, Richtext, Jsql } from '@darwino/darwino';
const { richTextToDisplayFormat, richTextToStorageFormat } = Richtext;
import { DocumentForm, 
    renderText } from '@darwino/darwino-react-onsenui';

import Constants from "./Constants";
import {checkUser,isDemoUser} from "./Demo";

import NavBar from "./NavBar";

const DATABASE = Constants.DATABASE;
const STORE = "companies";

const FORM_NAME = "company";

class Company extends DocumentForm {

    // Default values of the properties
    static defaultProps  = {
        databaseId: DATABASE,
        storeId: STORE
    };

    constructor(props,context) {
        super(props,context)
        this.userService = new UserService()
        this.renderToolbar = this.renderToolbar.bind(this);
    }

    renderToolbar() {
        return (
            <NavBar title={"Company"} backButton={true} action={{type:"save",handler:this.submit}}/>
          );
    }

    isReadOnly() {
        // This is for demo purposes, to let the demo user edit the document
        // Although this can be saved
        if(isDemoUser()) {
            return false;
        }
        return super.isReadOnly();
    }

    handleUpdateDocument(state, dispatch) {
        if(!checkUser(this)) {
            return;
        }
        super.handleUpdateDocument(state, dispatch);
    }
        
    render() {
        const { newDoc, doc } = this.state;
        const { handleSubmit, dirty, invalid, submitting, type } = this.props;
        const readOnly = this.isReadOnly();
        const disabled = this.isDisabled();

        return (
            <Page renderToolbar={this.renderToolbar}>
                <form onSubmit={handleSubmit(this.handleUpdateDocument)}>
                    <List>
                        <Field name="name" type="text" horizontal={true} component={renderText} label="Name" disabled={disabled} readOnly={readOnly}/>
                        <Field name="industry" type="text" horizontal={true} component={renderText} label="Industry" disabled={disabled} readOnly={readOnly}/>
                    </List>
                    {/*Uncomment to display the current JSON content*/}
                    {/* <JsonDebug form={this.props.form}/>   */}
                </form>
            </Page>            
        );
    }
}

const form = reduxForm({
    form: FORM_NAME,
    validate: DocumentForm.validateForm,
    onChange: DocumentForm.onChange
});

export default 
    connect(null,DocumentForm.mapDispatchToProps)
        (form(Company))
