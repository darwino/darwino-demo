/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Field, FieldArray, reduxForm } from 'redux-form';
import { Tabs, Tab, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

import { Jsql, JstoreCursor } from '@darwino/darwino';
import {  _t } from '@darwino/darwino';
import { DocumentForm, FormDebug, renderText, renderTextArea, renderStatic, renderSelect, renderCheckbox } from '@darwino/darwino-react-bootstrap';

import Constants from "../Constants";
import AllFieldsText from "./AllFieldsText";
import AllFieldsMultipleValues from "./AllFieldsMultipleValues";
import AllFieldsCheckboxes from "./AllFieldsCheckboxes";
import AllFieldsRadioButtons from "./AllFieldsRadioButtons";
import AllFieldsSelect from "./AllFieldsSelect";
import AllFieldsRichText from "./AllFieldsRichText";
import AllFieldsComputed from "./AllFieldsComputed";

const {DEFAULT_MODE,EDITABLE,DISABLED,READONLY} = DocumentForm


const FORM_NAME = "allfields";

//
// Demo page showing the different field editor
//
class AllFields extends DocumentForm {

    constructor(props,context) {
        super(props,context)
    }

    defaultValues(values) {
        values.MultipleInput = ["v1","v2"]
    }

    calculateOnChange(values) {
        const value = this.getFieldValue("SimpleInput","")
        values.UpperCase = value.toUpperCase()
        values.LowerCase = value.toLowerCase()
        values.CalculatedValue = this.getFieldValue("Value1","") + " - " + this.getFieldValue("Value2","")
    }   

    render() {
        const readOnly = this.isReadOnly();
        const disabled = this.isDisabled();
        return (
            <div>
                <form>
                    <h2>Field Access</h2>

                    <div className="col-md-12 col-sm-12">
                        <ToggleButtonGroup type="radio" name="mode" value={this.getMode()} onChange={(value)=>(this.setMode(value))}>
                            <ToggleButton value={EDITABLE}>{_t('allfields.editable','Editable')}</ToggleButton>                            
                            <ToggleButton value={DISABLED}>{_t('allfields.disabled','Disabled')}</ToggleButton>                            
                            <ToggleButton value={READONLY}>{_t('allfields.readonly','Readonly')}</ToggleButton>                            
                        </ToggleButtonGroup>
                    </div>
                    <Tabs defaultActiveKey={1} id="doctab">
                        <Tab eventKey={1} title={_t('allfields.singlevalue','Single Value')}>
                            <AllFieldsText mainForm={this}/>
                        </Tab>
                        <Tab eventKey={2} title={_t('allfields.multivalue','Multiple Values')}>
                            <AllFieldsMultipleValues mainForm={this}/>
                        </Tab>
                        <Tab eventKey={3} title={_t('allfields.checkboxes','Checkboxes')}>
                            <AllFieldsCheckboxes mainForm={this}/>
                        </Tab>
                        <Tab eventKey={4} title={_t('allfields.radiobuttons','Radio Buttons')}>
                            <AllFieldsRadioButtons mainForm={this}/>
                        </Tab>
                        <Tab eventKey={5} title={_t('allfields.select','Select')}>
                            <AllFieldsSelect mainForm={this}/>
                        </Tab>
                        <Tab eventKey={6} title={_t('allfields.rightext','Rich Text & Attachments')}>
                            <AllFieldsRichText mainForm={this}/>
                        </Tab>
                        <Tab eventKey={7} title={_t('allfields.computedfields','Computed Fields')}>
                            <AllFieldsComputed mainForm={this}/>
                        </Tab>
                    </Tabs>
                    {/*Uncomment to display the current FORM content*/}
                    <FormDebug/>
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
        (form(AllFields))
)
