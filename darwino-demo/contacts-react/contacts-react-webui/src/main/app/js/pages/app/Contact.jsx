/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React, { Component } from "react";
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form';
import { Link, Prompt } from "react-router-dom";
import { FormattedDate, FormattedTime } from "react-intl";
import { Panel, Tabs, Tab, Button, ButtonToolbar } from 'react-bootstrap';

import { UserService, Richtext, Jsql } from '@darwino/darwino';
const { richTextToDisplayFormat, richTextToStorageFormat } = Richtext;
import {JsonDebug} from "@darwino/darwino-react";
import { DocumentForm, ComputedField,
         renderText, renderRadioGroup, renderCheckbox, renderSelect, renderRichText, renderDatePicker } from '@darwino/darwino-react-bootstrap';

import Constants from "./Constants";
import CCAddress from "./CCAddress";
import {checkUser} from "./Demo";


const DATABASE = Constants.DATABASE;
const STORE = "_default";

const FORM_NAME = "contact";

export class Contact extends DocumentForm {

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
        values.title = "Contact Document"
        values.cdate = this.getDocument().cdate && new Date(this.getDocument().cdate)
        values.mdate = this.getDocument().mdate && new Date(this.getDocument().mdate)

        // These are not calculated fields as they are just objects that should not be passed to the
        // server as computed fields
        if(!this.cuser || this.cuser.getDn()!=this.getDocument().cuser) {
            this.cuser = this.userService.getUser(this.getDocument().cuser, (u,loaded) => {if(loaded) this.forceUpdate()})
        }
        if(!this.muser || this.muser.getDn()!=this.getDocument().muser) {
            this.muser = this.userService.getUser(this.getDocument().muser, (u,loaded) => {if(loaded) this.forceUpdate()})
        }
    }

    // Values computed every time the document is changed
    calculateOnChange(values) {
        values.fullname = this.getFieldValue("firstname","") + " " + this.getFieldValue("lastname","")
        values.fullnameUpper = this.getFieldValue("fullname","").toUpperCase()
    }

    // Transform the generic attachment links to physical ones
    prepareForDisplay(values) {
        if(values.card) values.card = richTextToDisplayFormat(this.state,values.card)
    }

    // Transform the physical attachment links back to generic ones
    prepareForSave(values) {
        if(values.card) values.card = richTextToStorageFormat(this.state,values.card)
    }

    contributeActionBar() {
        const { newDoc, doc } = this.state;
        const { invalid, submitting } = this.props;
        const readOnly = this.isReadOnly();
        const disabled = this.isDisabled();
        return (
            <span key="main">
                <span style={(disabled||readOnly) ? {display: 'none'} : {}}>
                    <Button bsStyle="primary" onClick={this.submit} disabled={invalid||submitting}>Submit</Button>
                    <div className="pull-right">
                        <Button onClick={this.delete} bsStyle="danger" style={newDoc ? {display: 'none'} : {}}>Delete</Button>
                    </div>
                </span>
                <Button bsStyle="link" onClick={this.cancel}>Cancel</Button>
            </span>
        );
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
            <div>
                <form onSubmit={handleSubmit(this.handleUpdateDocument)}>
                    {this.createActionBar()}
                    {this.createMessages()}
                    <Prompt
                        when={dirty}
                        message={location => (
                            `The contact is modified and not saved yet.\nDo you want to leave the current page without saving it?`
                        )}
                    />                    
                    <Tabs defaultActiveKey={1} id="doctab">
                        <Tab eventKey={1} title="Contact Information">
                            <fieldset>
                                <h2>{this.getFieldValue("title")}</h2>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="firstname" type="text" component={renderText} label="First Name" disabled={disabled} readOnly={readOnly}/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="lastname" type="text" component={renderText} label="Last Name" disabled={disabled} readOnly={readOnly}/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <ComputedField label="Full Name" name="fullnameUpper"/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="email" type="text" component={renderText} label="E-Mail" disabled={disabled} readOnly={readOnly}/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="sex" component={renderSelect} label="Sex" disabled={disabled} readOnly={readOnly}
                                        options={[
                                            { value: "", label: "- Select One -"},
                                            { value: "M", label: "Male"},
                                            { value: "F", label: "Female"}
                                        ]}
                                    />
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="firstcontact" component={renderDatePicker} label="Contact Since" disabled={disabled} readOnly={readOnly}/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Panel collapsible defaultExpanded header="Address">
                                        <CCAddress {...this.props} name=""/>
                                    </Panel>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Panel collapsible defaultExpanded header="Phone Numbers">
                                        <div className="col-md-12 col-sm-12">
                                            <Field name="homephone" type="text" component={renderText} label="Home" disabled={disabled} readOnly={readOnly}/>
                                        </div>
                                        <div className="col-md-12 col-sm-12">
                                            <Field name="mobilephone" type="text" component={renderText} label="Mobile" disabled={disabled} readOnly={readOnly}/>
                                        </div>
                                        <div className="col-md-12 col-sm-12">
                                            <Field name="workphone" type="text" component={renderText} label="Work" disabled={disabled} readOnly={readOnly}/>
                                        </div>
                                    </Panel>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="comments" component={renderRichText} label="Comments" disabled={disabled} readOnly={readOnly}/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Panel collapsible defaultExpanded header="Company">
                                        <div className="col-md-12 col-sm-12">
                                            <Field name="company" type="text" component={renderSelect} label="Company" disabled={disabled} readOnly={readOnly}
                                                options={this.state.allCompanies} emptyOption={true}/>
                                        </div>
                                    </Panel>
                                </div>
                            </fieldset>
                        </Tab>
                        <Tab eventKey={2} title="Business Card">
                            <fieldset>
                                <div>
                                    <div className="col-md-12 col-sm-12">
                                        <Field name="card" component={renderRichText} readOnly="true"/>
                                    </div>
                                </div>
                            </fieldset>
                        </Tab>
                        <Tab eventKey={3} title="Document Information">
                            {(cuser && muser && cdate && mdate) && <fieldset>
                                <div>
                                    <div className="col-md-12 col-sm-12">
                                        <ComputedField label="Created On">
                                            <FormattedDate value={cdate}/>,<FormattedTime value={cdate}/>
                                        </ComputedField>
                                    </div>
                                    <div className="col-md-12 col-sm-12">
                                        <ComputedField label="Created By">
                                            <img src={cuser.getPhotoUrl()} className="img-circle" style={{width: 25, height: 25}}/>
                                            &nbsp;
                                            {cuser.getCn()}
                                        </ComputedField>
                                    </div>
                                    <div className="col-md-12 col-sm-12">
                                        <ComputedField label="Last Modified On">
                                            <FormattedDate value={mdate}/>,<FormattedTime value={mdate}/>
                                    </ComputedField>
                                    </div>
                                    <div className="col-md-12 col-sm-12">
                                        <ComputedField label="Last Modified By">
                                            <img src={muser.getPhotoUrl()} className="img-circle" style={{width: 25, height: 25}}/>
                                            &nbsp;
                                            {muser.getCn()}
                                        </ComputedField>
                                    </div>
                                </div>
                            </fieldset>
                            }
                        </Tab>
                    </Tabs>
                    <div>
                        <span style={(disabled||readOnly) ? {display: 'none'} : {}}>
                            <div className="pull-right">
                                <Button onClick={this.handleDeleteDocument} bsStyle="danger" style={newDoc ? {display: 'none'} : {}}>Delete</Button>
                            </div>
                            <Button bsStyle="primary" type="submit" disabled={invalid||submitting}>Submit</Button>
                        </span>
                        <Button bsStyle="link" onClick={this.handleCancel}>Cancel</Button>
                    </div>
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
        (form(Contact))
)
