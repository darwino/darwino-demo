/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form';
import { Tabs, Tab, ToggleButtonGroup, ToggleButton} from 'react-bootstrap';

import { DocumentForm } from '@darwino/darwino-react-bootstrap';

import Constants from "../Constants";
import FormLayoutStacked from "./FormLayoutStacked";
import FormLayoutHorizontal from "./FormLayoutHorizontal";
import FormLayoutComponents from "./FormLayoutComponents";

const {DEFAULT_MODE,EDITABLE,DISABLED,READONLY} = DocumentForm
const FORM_NAME = "formlayout";

//
// Demo page showing the different field editor
//
class FormLayout extends DocumentForm {

    constructor(props,context) {
        super(props,context)
    }

    defaultValues(values) {
        values.MultipleInput = ["v1","v2"]
    }

    render() {
        return (
            <div>
                <h2>Form Layout</h2>

                <div className="col-md-12 col-sm-12">
                    <ToggleButtonGroup type="radio" name="mode" value={this.getMode()} onChange={(value)=>(this.setMode(value))}>
                        <ToggleButton value={EDITABLE}>Editable</ToggleButton>                            
                        <ToggleButton value={DISABLED}>Disabled</ToggleButton>                            
                        <ToggleButton value={READONLY}>Readonly</ToggleButton>                            
                    </ToggleButtonGroup>
                </div>

                <Tabs defaultActiveKey={1} id="doctab">
                    <Tab eventKey={1} title="Stacked Labels">
                        <FormLayoutStacked mainForm={this}/>
                    </Tab>
                    <Tab eventKey={2} title="Horizontal Labels">
                        <FormLayoutHorizontal mainForm={this}/>
                    </Tab>
                    <Tab eventKey={3} title="Components">
                        <FormLayoutComponents mainForm={this}/>
                    </Tab>
                </Tabs>
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
        (form(FormLayout))
)
