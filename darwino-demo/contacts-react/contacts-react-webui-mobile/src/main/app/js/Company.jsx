/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React, {Component} from "react";
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form';
import {
    Page,
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
const STORE = "_default";

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
            <NavBar title={"Contact"} backButton={true} action={{type:"save",handler:this.submit}}/>
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
        const {cdate, mdate} = this.getComputedValues()
        const {cuser,  muser} = this

        return (
            <Page renderToolbar={this.renderToolbar}>
                <form onSubmit={handleSubmit(this.handleUpdateDocument)}>
                    <h2>{this.getFieldValue("title")}</h2>
                    <div>
                        <Field name="firstname" type="text" component={renderText} label="First Name" disabled={disabled} readOnly={readOnly}/>
                    </div>
                    <div>
                        <Field name="lastname" type="text" component={renderText} label="Last Name" disabled={disabled} readOnly={readOnly}/>
                    </div>
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
