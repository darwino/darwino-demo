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
const STORE = "_default";

const FORM_NAME = "contact";

class Contact extends DocumentForm {

    // Default values of the properties
    static defaultProps  = {
        databaseId: DATABASE,
        storeId: STORE
    };

    constructor(props,context) {
        super(props,context)
        this.userService = new UserService()
        
        // Get the list of companies
        new Jsql()
            .database(props.databaseId)
            .query("SELECT $.name name FROM companies WHERE $.form='Company' ORDER BY name")
            .format('value')
            .fetch()
            .then((json) => {
                this.setState({allCompanies: json})
            });
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

    // Default values when a new document is created
    defaultValues(values) {
        values.form = "Contact"
        values.firstname = "Leonardo"
        values.lastname = "da Vinci"
    }

    // Validation
    validate(values) {
        const errors = {};
        // Add the validation rules here!
        if(!values.firstname) {
            errors.firstname = "Missing First Name"
        }
        if(!values.lastname) {
            errors.lastname = "Missing Last Name"
        }
        return errors;
    }

    // Values computed once when the document is loaded
    calculateOnLoad(values) {
        // None in this demo
    }

    // Values computed every time the document is changed
    calculateOnChange(values) {
        // None in this demo
    }

    // Transform the generic attachment links to physical ones
    prepareForDisplay(values) {
        if(values.card) values.card = richTextToDisplayFormat(this.state,values.card)
    }

    // Transform the physical attachment links back to generic ones
    prepareForSave(values) {
        if(values.card) values.card = richTextToStorageFormat(this.state,values.card)
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
                        <Field name="firstname" type="text" component={renderText} label="First Name" disabled={disabled} readOnly={readOnly}/>
                        <Field name="lastname" type="text" component={renderText} label="Last Name" disabled={disabled} readOnly={readOnly}/>
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
        (form(Contact))

