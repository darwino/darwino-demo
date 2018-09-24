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
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form';
import { Link, Prompt } from "react-router-dom";
import { FormattedDate, FormattedTime } from "react-intl";
import { Panel, Tabs, Tab, Button, ButtonToolbar } from 'react-bootstrap';

import {  _t } from '@darwino/darwino';
import { UserService, Richtext, Jsql } from '@darwino/darwino';
const { richTextToDisplayFormat, richTextToStorageFormat } = Richtext;
import {JsonDebug} from "@darwino/darwino-react";
import { DocumentForm, ComputedField,
         renderText, renderRadioGroup, renderCheckbox, renderSelect, renderRichText, renderDatePicker, renderAttachments } from '@darwino/darwino-react-bootstrap';

import Constants from "./Constants";
import CCAddress from "./CCAddress";
import {checkUser,isDemoUser} from "./Demo";


const DATABASE = Constants.DATABASE;
const STORE = "_default";

const FORM_NAME = "contact";

export class Contact extends DocumentForm {

    // Default values of the properties
    static get defaultProps() { 
        return {
            databaseId: DATABASE,
            storeId: STORE
        }
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
            errors.firstname = _t("contact.errfname","Missing First Name")
        }
        if(!values.lastname) {
            errors.lastname = _t("contact.errlname","Missing Last Name")
        }
        return errors;
    }

    // Values computed once when the document is loaded
    calculateOnLoad(values) {
        values.title = _t("contact.title","Contact Document")
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
                    <Button bsStyle="primary" onClick={this.submit} disabled={invalid||submitting}>{_t("contact.submit","Submit")}</Button>
                    <div className="pull-right">
                        <Button onClick={this.delete} bsStyle="danger" style={newDoc ? {display: 'none'} : {}}>{_t("contact.delete","Delete")}</Button>
                    </div>
                </span>
                <Button bsStyle="link" onClick={this.cancel}>{_t("contact.cancel","Cancel")}</Button>
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
                            _t("contact.saveprompt","The contact is modified and not saved yet.\nDo you want to leave the current page without saving it?")
                        )}
                    />                    
                    <Tabs defaultActiveKey={1} id="doctab">
                        <Tab eventKey={1} title={_t("contact.tabinfo","Contact Information")}>
                            <fieldset>
                                <h2>{this.getFieldValue("title")}</h2>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="firstname" type="text" component={renderText} label={_t("contact.fname","First Name")} disabled={disabled} readOnly={readOnly}/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="lastname" type="text" component={renderText} label={_t("contact.lname","Last Name")} disabled={disabled} readOnly={readOnly}/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <ComputedField label={_t("contact.fullname","Full Name")} name="fullnameUpper"/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="email" type="text" component={renderText} label={_t("contact.email","E-Mail")} disabled={disabled} readOnly={readOnly}/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="sex" component={renderSelect} label={_t("contact.sex","Sex")} disabled={disabled} readOnly={readOnly}
                                        options={[
                                            { value: "", label: _t("contact.selone","- Select One -") },
                                            { value: "M", label: _t("contact.male","Male") },
                                            { value: "F", label: _t("contact.female","Female") }
                                        ]}
                                    />
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="firstcontact" component={renderDatePicker} label={_t("contact.firstcomt","Contact Since")} disabled={disabled} readOnly={readOnly}/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Panel collapsible defaultExpanded header={_t("contact.address","Address")}>
                                        <CCAddress {...this.props} name=""/>
                                    </Panel>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Panel collapsible defaultExpanded header={_t("contact.phonenum","Phone Numbers")}>
                                        <div className="col-md-12 col-sm-12">
                                            <Field name="homephone" type="text" component={renderText} label={_t("contact.home","Home")} disabled={disabled} readOnly={readOnly}/>
                                        </div>
                                        <div className="col-md-12 col-sm-12">
                                            <Field name="mobilephone" type="text" component={renderText} label={_t("contact.mobile","Mobile")} disabled={disabled} readOnly={readOnly}/>
                                        </div>
                                        <div className="col-md-12 col-sm-12">
                                            <Field name="workphone" type="text" component={renderText} label={_t("contact.work","Work")} disabled={disabled} readOnly={readOnly}/>
                                        </div>
                                    </Panel>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="comments" component={renderRichText} label={_t("contact.comments","Comments")} disabled={disabled} readOnly={readOnly}/>
                                    <Field name="__attachments" colLength={false} component={renderAttachments} label={_t("africhtext.att","Attachments")} buttonLabel={_t("africhtext.addfile","Add a New File...")} disabled={disabled} readOnly={readOnly}
                                        onUpload={(att) => {
                                            console.log("Attachment Upload: "+att.name+", "+att.length);
                                            let ok = att.length<1024*1024;
                                            if(!ok) {
                                                alert(_t("africhtext.attsize","Attachment is greater than 1M and cannot be uploaded"));
                                            }
                                            return ok;
                                        }}
                                        onDelete={(att) => {console.log("Attachment Delete: "+att.name);return true;}}
                                    />
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Panel collapsible defaultExpanded header={_t("contact.company","Company")}>
                                        <div className="col-md-12 col-sm-12">
                                            <Field name="company" type="text" component={renderSelect} label={_t("contact.company","Company")} disabled={disabled} readOnly={readOnly}
                                                options={this.state.allCompanies} emptyOption={true}/>
                                        </div>
                                    </Panel>
                                </div>
                            </fieldset>
                        </Tab>
                        <Tab eventKey={2} title={_t("contact.buscard","Business Card")}>
                            <fieldset>
                                <div>
                                    <div className="col-md-12 col-sm-12">
                                        <Field name="card" component={renderRichText} readOnly="true"/>
                                    </div>
                                </div>
                            </fieldset>
                        </Tab>
                        <Tab eventKey={3} title={_t("contact.docinfo","Document Information")}>
                            {(cuser && muser && cdate && mdate) && <fieldset>
                                <div>
                                    <div className="col-md-12 col-sm-12">
                                        <ComputedField label={_t("contact.creaton","Created On")}>
                                            <FormattedDate value={cdate}/>,<FormattedTime value={cdate}/>
                                        </ComputedField>
                                    </div>
                                    <div className="col-md-12 col-sm-12">
                                        <ComputedField label={_t("contact.createdby","Created By")}>
                                            <img src={cuser.getPhotoUrl()} className="img-circle" style={{width: 25, height: 25}}/>
                                            &nbsp;
                                            {cuser.getCn()}
                                        </ComputedField>
                                    </div>
                                    <div className="col-md-12 col-sm-12">
                                        <ComputedField label={_t("contact.lastmoddat","Last Modified On")}>
                                            <FormattedDate value={mdate}/>,<FormattedTime value={mdate}/>
                                    </ComputedField>
                                    </div>
                                    <div className="col-md-12 col-sm-12">
                                        <ComputedField label={_t("contact.lastmodby","Last Modified By")}>
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
                                <Button onClick={this.handleDeleteDocument} bsStyle="danger" style={newDoc ? {display: 'none'} : {}}>{_t("contact.delete","Delete")}</Button>
                            </div>
                            <Button bsStyle="primary" type="submit" disabled={invalid||submitting}>{_t("contact.tabnfo","Submit")}</Button>
                        </span>
                        <Button bsStyle="link" onClick={this.handleCancel}>{_t("contact.cancel","Cancel")}</Button>
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
