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
import {  Prompt } from "react-router-dom";
import { Panel } from 'react-bootstrap';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

import {  _t } from '@darwino/darwino';
import { renderText } from '@darwino/darwino-react-bootstrap';
import { FormPage } from '@darwino/darwino-react-bootstrap-notes';

import Constants from "./../Constants";
import CCAddress from "./CCAddress";
import {checkUser} from "../Demo";


const DATABASE = Constants.DATABASE;
const STORE = "_default";

const FORM_NAME = "contact";

export class Contact extends FormPage {

    // Default values of the properties
    static get defaultProps() { 
        return {
            databaseId: DATABASE,
            storeId: STORE
        }
    };


    handleUpdateDocument(state, dispatch) {
        if(!checkUser(this)) {
            return;
        }
        super.handleUpdateDocument(state, dispatch);
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
            errors.firstname = _t("notescontact.missfname","Missing First Name");
        }
        if(!values.lastname) {
            errors.lastname = _t("notescontact.misslname","Missing Last Name");
        }
        return errors;
    }

    // Values computed once when the document is loaded
    calculateOnLoad(values) {
        values.title = _t("notescontact.title","Contact Document");
    }

    // Values computed every time the document is changed
    calculateOnChange(values) {
        values.fullname = this.getFieldValue("firstname","") + " " + this.getFieldValue("lastname","")
        values.fullnameUpper = this.getFieldValue("fullname","").toUpperCase()
    }

    contributeActionBar() {
        return (
            <Nav key="main">
                <NavItem eventKey={1} href="#" onClick={this.submit}>{_t("notescontact.save","Save")}</NavItem>
                <NavItem eventKey={2} href="#" onClick={this.cancel}>{_t("notescontact.cancel","Cancel")}</NavItem>
                <NavDropdown eventKey={3} title={_t("notescontact.formact","Form Actions")} id="form-nav-dropdown">
                    <MenuItem eventKey={3.1}>{_t("notescontact.action1","Action 1")}</MenuItem>
                    <MenuItem eventKey={3.2}>{_t("notescontact.action2","Action 3")}</MenuItem>
                    <MenuItem eventKey={3.3}>{_t("notescontact.action3","Action 3")}</MenuItem>
                    <MenuItem divider />
                    <MenuItem eventKey={3.4}>{_t("notescontact.action4","Action 4")}</MenuItem>
                </NavDropdown>
            </Nav>
        );
    }

    render() {
        const { handleSubmit, dirty } = this.props;
        const readOnly = this.isReadOnly();
        const disabled = this.isDisabled();
        
        return (
            <div>
                {this.createMessages()}
                <form onSubmit={handleSubmit(this.handleUpdateDocument)}>
                    {this.createActionBar()}
                    <Prompt
                        when={dirty}
                        message={location => (
                            _t("notescontact.saveconf","The contact is modified and not saved yet.\nDo you want to leave the current page without saving it?")
                        )}
                    />                    
                    <fieldset>
                        <h2>{this.getFieldValue("title")}</h2>

                        <div className="col-md-12 col-sm-12">
                            <Field name="firstname" type="text" component={renderText} label={_t("notescontact.fname","First Name")} disabled={disabled} readOnly={readOnly}/>
                        </div>

                        <div className="col-md-12 col-sm-12">
                            <Field name="lastname" type="text" component={renderText} label={_t("notescontact.lname","Last Name")} disabled={disabled} readOnly={readOnly}/>
                        </div>

                        <div className="col-md-12 col-sm-12">
                            <Panel collapsible defaultExpanded header={_t("notescontact.address","Address")}>
                                <CCAddress {...this.props} name=""/>
                            </Panel>
                        </div>
                    </fieldset>
                    {/*Uncomment to display the current JSON content*/}
                    {/* <JsonDebug form={this.props.form}/>   */}
                </form>
            </div>
        );
  }
}

const form = reduxForm({
    form: FORM_NAME,
    validate: FormPage.validateForm,
    onChange: FormPage.onChange
});

export default withRouter(
    connect(null,FormPage.mapDispatchToProps)
        (form(Contact))
)
