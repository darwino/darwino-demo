/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form';
import { Tabs, Tab, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

import { JstoreCursor, Jsql } from '@darwino/darwino';
import { DocumentForm, CursorGrid, ListPicker, GridPicker, CursorGridPicker, UserPicker, renderText, renderValuePicker } from '@darwino/darwino-react-bootstrap';

import {JsonDebug} from "@darwino/darwino-react";

import Constants from "../Constants.jsx";

const {DEFAULT_MODE,EDITABLE,DISABLED,READONLY} = DocumentForm
const FORM_NAME = "pickers";

//
// Demo page showing the different pickers
//
class Pickers extends DocumentForm {

    constructor(props,context) {
        super(props,context)
    }

    picker1() {
        return (
            <ListPicker
                values={["one", "two", "three", "four"]}
            />
        )
    }

    picker2() {
        return (
            <ListPicker
                value="value"
                label="label"
                values={[
                    {value:1, label:"one"}, 
                    {value:2, label:"two"}, 
                    {value:3, label:"three"}, 
                    {value:4, label:"four"}
                ]}
            />
        )
    }

    picker3() {
        let jsc = new JstoreCursor()
            .database(Constants.DATABASE)
            .store("_default")
            .queryParams({name:"AllCompanies"})
        return (
            <ListPicker
                value="Name"
                label={(e) => e.Name + " (" + e.State + ")"}
                dataLoader={jsc.getDataLoader()}
            />
        )
    }

    picker4() {
        let jsc = new JstoreCursor()
            .database(Constants.DATABASE)
            .store("_default")
            .queryParams({name:"AllCompanies"})
        return (
            <GridPicker
                value="Name"
                dataLoader={jsc.getDataLoader()}
                grid={{
                    columns:[
                        {name: "Name", key: "Name", sortable: true, sortField: 'name'},
                        {name: "Industry", key: "Industry", sortable: true, sortField: 'industry'},
                        {name: "State", key: "State", sortable: true, sortField: 'state'}
                    ]
                }}
            />
        )
    }

    picker5() {
        let jsc = new JstoreCursor()
            .database(Constants.DATABASE)
            .store("_default")
            .queryParams({name:"AllCompanies"})
        // The cursor to display
        const cursorGrid = (
            <CursorGrid
                databaseId={Constants.DATABASE}
                params={{
                    name: "AllCompanies"
                }}
                ftSearch= {true}
                grid={{
                    columns:[
                        {name: "Industry", key: "Industry", sortable: true, sortField: 'industry'},
                        {name: "State", key: "State", sortable: true, sortField: 'state'},
                        {name: "Name", key: "Name", sortable: true, sortField: 'name'}
                    ]
                }}
                groupBy= {["Industry","State"]}
                baseRoute="/app/company"
            />
        )
        return (
            <CursorGridPicker
                value="Name"
                cursorGrid={cursorGrid}
            />
        )
    }

    pickeru1() {
        return (
            <UserPicker
            />
        )
    }

    render() {
        const readOnly = this.isReadOnly();
        const disabled = this.isDisabled();
        return (
            <div>
                <form>
                    <h2>All Pickers in one page!</h2>

                    <div className="col-md-12 col-sm-12">
                        <ToggleButtonGroup type="radio" name="mode" value={this.getMode()} onChange={(value)=>(this.setMode(value))}>
                            <ToggleButton value={EDITABLE}>Editable</ToggleButton>                            
                            <ToggleButton value={DISABLED}>Disabled</ToggleButton>                            
                            <ToggleButton value={READONLY}>Readonly</ToggleButton>                            
                        </ToggleButtonGroup>
                    </div>

                    <Tabs defaultActiveKey={1} id="doctab">
                        <Tab eventKey={1} title="Value Pickers">
                            <fieldset>
                                <div className="col-md-12 col-sm-12">
                                    <Field name="value11" type="text" component={renderValuePicker} label="Not Editable String Value" disabled={disabled} readOnly={readOnly}
                                            picker={this.picker1}/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="value12" type="text" component={renderValuePicker} label="Editable String Value" disabled={disabled} readOnly={readOnly}
                                            editable={true}
                                            picker={this.picker1}/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="value2" type="text" component={renderValuePicker} label="Static Integer with a label" disabled={disabled} readOnly={readOnly}
                                            picker={this.picker2}/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="value3" type="text" component={renderValuePicker} label="Select a Company from a databases list" disabled={disabled} readOnly={readOnly}
                                            picker={this.picker3}
                                            pickerTitle="Select a company"/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="value4" type="text" component={renderValuePicker} label="Select a Company using a simple grid" disabled={disabled} readOnly={readOnly}
                                            picker={this.picker4}
                                            pickerTitle="Select a company"/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="value5" type="text" component={renderValuePicker} label="Select a Company using a CursorGrid" disabled={disabled} readOnly={readOnly}
                                            picker={this.picker5}
                                            pickerTitle="Select a company"/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="value6" type="text" component={renderValuePicker} label="Embedded picker" disabled={disabled} readOnly={readOnly}
                                        picker={(
                                            <ListPicker
                                                values={["one", "two", "three"]}
                                            />
                                        )}/>
                                </div>
                                <div className="col-md-12 col-sm-12">
                                    <Field name="value7" type="text" component={renderValuePicker} label="Company picker (promise)" disabled={disabled} readOnly={readOnly}
                                        picker={(
                                            <ListPicker
                                                values={
                                                    new Jsql()
                                                        .database(Constants.DATABASE)
                                                        .query("SELECT $.name name FROM companies WHERE $.form='Company' ORDER BY name")
                                                        .format('value')
                                                        .fetch()                                                    
                                                }
                                            />
                                        )}
                                        pickerTitle="Choose a company"/>
                                </div>
                            </fieldset>
                        </Tab>
                        <Tab eventKey={2} title="User Pickers">
                            <fieldset>
                                <div className="col-md-12 col-sm-12">
                                    <Field name="valueu1" type="text" component={renderValuePicker} label="Single User Picker Dialog" disabled={disabled} readOnly={readOnly}
                                            picker={this.pickeru1}
                                            pickerTitle="Select a user"/>
                                </div>
                            </fieldset>
                        </Tab>
                        <Tab eventKey={3} title="Multiple Values">
                            <fieldset>
                                <div className="col-md-12 col-sm-12">
                                    <Field name="valuem1" multiple={true} component={renderValuePicker} label="String Value" disabled={disabled} readOnly={readOnly}
                                            picker={this.picker1}/>
                                </div>
                                <div className="col-md-12 col-sm-12">
                                    <Field name="valuemu1" multiple={true} component={renderValuePicker} label="User Picker Dialog" disabled={disabled} readOnly={readOnly}
                                            picker={this.pickeru1}
                                            pickerTitle="Select Users"/>
                                </div>
                            </fieldset>
                        </Tab>
                    </Tabs>
                    {/*Uncomment to display the current JSON content*/}
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
        (form(Pickers))
)
