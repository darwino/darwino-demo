/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Field, FieldArray, reduxForm } from 'redux-form';
import { Tabs, Tab } from 'react-bootstrap';

import { JstoreCursor, Jsql } from '@darwino/darwino';
import {JsonDebug} from "@darwino/darwino-react";
import { DocumentForm, renderText, renderTextArea, renderStatic,renderSelect } from '@darwino/darwino-react-bootstrap';

import Constants from "../Constants.jsx";


const FORM_NAME = "dbselect";

//
// Demo page showing comboboxes with dynamic options
//
class DynamicSelect extends DocumentForm {

    constructor(props,context) {
        super(props,context)
        this.state = {
            companies: [],
            currentCompany: undefined,
            users: []
        }

        // This is static and only executed once
        new Jsql()
            .database(Constants.DATABASE)
            .query("SELECT $.name name FROM companies WHERE $.form='Company' ORDER BY name")
            .format('value')
            .fetch()
            .then((json) => {
                this.setState({companies: json})
            });
    }

    calculateOnChange(values) {
        // The list of users depends on the current company.
        // We recalculate it after a change
        let company = this.getFieldValue("company")
        if(company!=this.state.currentCompany) {
            if(company) {
                new Jsql()
                    .database(Constants.DATABASE)
                    .query("SELECT $.firstname fname, $.lastname lname FROM _default WHERE $.company=:key ORDER BY fname, lname")
                    .params({key:company})
                    .fetch()
                    .then((json) => {
                        // In case the field has changed before we got the result back...
                        if(company==this.getFieldValue("company")) {
                            json = json.map((e) => {
                                return e.fname + " " + e.lname;
                            });
                            this.setState({currentCompany:company, users: json})
                            // Make the first user the selected one
                            if(json && json.length) {
                                this.setFieldValue("employee",json[0]);
                            }
                        }
                    });
            } else {
                this.setState({currentCompany:company, users: []})
            }
        }
    }

    render() {
        return (
            <div>
                <form>
                    <h2>Depending Selects</h2>
                    <p>
                        The employee select list depends on the company being selected.
                    </p>
                    <fieldset>
                        <div className="col-md-12 col-sm-12">
                            <Field name="company" component={renderSelect} label="Company"
                                options={this.state.companies} emptyOption={true}/>
                        </div>
                        <div className="col-md-12 col-sm-12">
                            <Field name="employee" component={renderSelect} label="Employee"
                                options={this.state.users} emptyOption={true}/>
                        </div>
                    </fieldset>
                    {/*Uncomment to display the current JSON content*/}
                    <h4>JSON Content</h4>
                    <JsonDebug form={this.props.form}/>
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
        (form(DynamicSelect))
)
