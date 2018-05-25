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
import { Tabs, Tab, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

import {  _t } from '@darwino/darwino';
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
                values={[
                    _t("pickers.one","one"), 
                    _t("pickers.two","two"), 
                    _t("pickers.three","three")
                ]}
            />
        )
    }

    picker2() {
        return (
            <ListPicker
                value="value"
                label="label"
                values={[
                    {value:1, label:_t("pickers.one","one")}, 
                    {value:2, label:_t("pickers.two","two")}, 
                    {value:3, label:_t("pickers.three","three")}, 
                    {value:4, label:_t("pickers.four","four")}
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
                columns={[
                    {name: "Name", key: "Name", sortable: true, sortField: 'name'},
                    {name: "Industry", key: "Industry", sortable: true, sortField: 'industry'},
                    {name: "State", key: "State", sortable: true, sortField: 'state'}
                ]}
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
                columns={[
                    {name: "Industry", key: "Industry", sortable: true, sortField: 'industry'},
                    {name: "State", key: "State", sortable: true, sortField: 'state'},
                    {name: "Name", key: "Name", sortable: true, sortField: 'name'}
                ]}
                groupBy= {[{column:"Industry"},{column:"State"}]}
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
                    <h2>{_t("pickers.title","All Pickers in one page!")}</h2>

                    <div className="col-md-12 col-sm-12">
                        <ToggleButtonGroup type="radio" name="mode" value={this.getMode()} onChange={(value)=>(this.setMode(value))}>
                            <ToggleButton value={EDITABLE}>{_t("pickers.editable","Editable")}</ToggleButton>                            
                            <ToggleButton value={DISABLED}>{_t("pickers.disabled","Disabled")}</ToggleButton>                            
                            <ToggleButton value={READONLY}>{_t("pickers.readonly","Readonly")}</ToggleButton>                            
                        </ToggleButtonGroup>
                    </div>

                    <Tabs defaultActiveKey={1} id="doctab">
                        <Tab eventKey={1} title={_t("pickers.tabpick","Value Pickers")}>
                            <fieldset>
                                <div className="col-md-12 col-sm-12">
                                    <Field name="value11" type="text" component={renderValuePicker} label={_t("pickers.noteditval","Not Editable String Value")} disabled={disabled} readOnly={readOnly}
                                            picker={this.picker1}/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="value12" type="text" component={renderValuePicker} label={_t("pickers.editval","Editable String Value")} disabled={disabled} readOnly={readOnly}
                                            editable={true}
                                            picker={this.picker1}/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="value2" type="text" component={renderValuePicker} label={_t("pickers.staticint","Static Integer with a label")} disabled={disabled} readOnly={readOnly}
                                            picker={this.picker2}/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="value3" type="text" component={renderValuePicker} label={_t("pickers.sellist","Select a Company from a databases list")} disabled={disabled} readOnly={readOnly}
                                            picker={this.picker3}
                                            pickerTitle={_t("pickers.selcomp","Select a company")}/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="value4" type="text" component={renderValuePicker} label={_t("pickers.selgrid","Select a Company using a simple grid")} disabled={disabled} readOnly={readOnly}
                                            picker={this.picker4}
                                            pickerTitle={_t("pickers.selcomp","Select a company")}/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="value5" type="text" component={renderValuePicker} label={_t("pickers.selcurgrid","Select a Company using a CursorGrid")} disabled={disabled} readOnly={readOnly}
                                            picker={this.picker5}
                                            pickerTitle={_t("pickers.selcomp","Select a company")}/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="value6" type="text" component={renderValuePicker} label={_t("pickers.embpick","Embedded picker")} disabled={disabled} readOnly={readOnly}
                                        picker={(
                                            <ListPicker
                                                values={[
                                                    _t("pickers.one","one"), 
                                                    _t("pickers.two","two"), 
                                                    _t("pickers.three","three")
                                                ]}
                                            />
                                        )}/>
                                </div>
                                <div className="col-md-12 col-sm-12">
                                    <Field name="value7" type="text" component={renderValuePicker} label={_t("pickers.compickprom","Company picker (promise)")} disabled={disabled} readOnly={readOnly}
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
                                        pickerTitle={_t("pickers.selcomp","Select a company")}/>
                                </div>
                            </fieldset>
                        </Tab>
                        <Tab eventKey={2} title={_t("pickers.userpicks","User Pickers")}>
                            <fieldset>
                                <div className="col-md-12 col-sm-12">
                                    <Field name="valueu1" type="text" component={renderValuePicker} label={_t("pickers.singusr","Single User Picker Dialog")} disabled={disabled} readOnly={readOnly}
                                            picker={this.pickeru1}
                                            pickerTitle={_t("pickers.seluser","Select a user")}/>
                                </div>
                            </fieldset>
                        </Tab>
                        <Tab eventKey={3} title={_t("pickers.mulvalues","Multiple Values")}>
                            <fieldset>
                                <div className="col-md-12 col-sm-12">
                                    <Field name="valuem1" multiple={true} component={renderValuePicker} label={_t("pickers.stringval","String Value")} disabled={disabled} readOnly={readOnly}
                                            picker={this.picker1}/>
                                </div>
                                <div className="col-md-12 col-sm-12">
                                    <Field name="valuemu1" multiple={true} component={renderValuePicker} label={_t("pickers.usrpickdlg","User Picker Dialog")} disabled={disabled} readOnly={readOnly}
                                            picker={this.pickeru1}
                                            pickerTitle={_t("pickers.selusers","Select users")}/>
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
