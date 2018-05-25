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
import React, {Component} from "react";
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux'
import { Button, ButtonToolbar, ControlLabel } from 'react-bootstrap';
import { Jsql } from '@darwino/darwino';
import {  _t } from '@darwino/darwino';
import { ListPicker, Dialog, DocumentForm, renderText } from '@darwino/darwino-react-bootstrap';

import Constants from "../Constants.jsx";

class _CustomForm extends DocumentForm {
    constructor(props,context) {
        super(props,context)
    }
    handleUpdateDocument(state, dispatch) {
        alert()
    }
    render() {
        const { handleSubmit, dirty, invalid, submitting, type } = this.props;
        const readOnly = this.isReadOnly();
        const disabled = this.isDisabled();
        return (
            <div>
                <form onSubmit={handleSubmit(this.handleUpdateDocument)}>
                    <fieldset>
                        <h2>{this.getFieldValue("title")}</h2>

                        <div className="col-md-12 col-sm-12">
                            <Field name="firstname" type="text" component={renderText} label={_t("codedlg.firstname","First Name")} disabled={disabled} readOnly={readOnly}/>
                        </div>
                        <div className="col-md-12 col-sm-12">
                            <Field name="lastname" type="text" component={renderText} label={_t("codedlg.lastname","Last Name")} disabled={disabled} readOnly={readOnly}/>
                        </div>
                    </fieldset>
                </form>
            </div>
        );
    }
}    
const cform = reduxForm({
    form: "CustomForm",
    validate: DocumentForm.validateForm,
    onChange: DocumentForm.onChange
});
const CustomForm = (
    connect(null,DocumentForm.mapDispatchToProps)
        (cform(_CustomForm))
)


class CodeMessages extends Component {

    render() {
        const {mainForm} = this.props;
        return (
            <div className="col-md-12 col-sm-12">
                <fieldset>
                <div className="col-md-12 col-sm-12">
                    <ControlLabel>{_t("codedlg.alertbox","Alert Box")}</ControlLabel>
                    <p>
                        {_t("codedlg.descalert","Equivalent to javascript alert()")}
                    </p>
                    <ButtonToolbar>
                        <Button bsStyle="primary" onClick={()=>
                            mainForm.getDialog().alert({message:_t("codedlg.clicked","You clicked me!")})
                        }>Simple Alert</Button>
                        <Button bsStyle="primary" onClick={()=>
                            mainForm.getDialog().alert({
                                message:_t("codedlg.clickedokcancel","You clicked me!"),
                                onClose:(action,value) => alert(_t("codedlg.clickedconf","I confirm, you clicked it"))
                            })}>Alert with Notification</Button>
                    </ButtonToolbar>
                </div>

                <div className="col-md-12 col-sm-12">
                    <ControlLabel>{_t("codedlg.askconf","Ask for a confirmation")}</ControlLabel>
                    <p>
                        {_t("codedlg.descconf","Equivalent to javascript confirm()")}
                    </p>
                    <ButtonToolbar>
                        <Button bsStyle="primary" onClick={()=>
                            mainForm.getDialog().okCancel({
                                message:_t("codedlg.okcancel","Click Ok or Cancel my friend"),
                                onClose:(action,value) => alert(_t("codedlg.youclick","You clicked ")+(action?"Ok":"Cancel"))
                            })}>Confirm, Ok/Cancel</Button>
                        <Button bsStyle="primary" onClick={()=>mainForm.getDialog().yesNo({
                                message:_t("codedlg.clickedyesno","Click Yes or No my friend"),
                                onClose:(action,value) => alert(_t("codedlg.youclick","You clicked ")+(action==Dialog.YES?"Yes":"No"))
                            })}>{_t("codedlg.yesno","Confirm, Yes/No")}</Button>
                    </ButtonToolbar>
                </div>

                <div className="col-md-12 col-sm-12">
                    <ControlLabel>{_t("codedlg.custdialog","Custom dialog")}</ControlLabel>
                    <p>
                        {_t("codedlg.descdlgfrm","Display a dialog containing a form")}
                    </p>
                    <ButtonToolbar>
                        <Button bsStyle="primary" onClick={()=>
                            mainForm.getDialog().form({
                                title:_t("codedlg.enterinf","Enter Your information"),
                                form: (<CustomForm/>),
                                onClose:(action,value) => alert(_t("codedlg.youenter","You Entered: ")+(JSON.stringify(value,2)))
                            })}>Enter your information</Button>
                    </ButtonToolbar>
                </div>

                <div className="col-md-12 col-sm-12">
                    <ControlLabel>{_t("codedlg.promptval","Prompt for a value")}</ControlLabel>
                    <p>
                        {_t("codedlg.descprompt","Equivalent to javascript prompt()")}
                    </p>
                    <ButtonToolbar>
                        <Button bsStyle="primary" onClick={()=>
                            mainForm.getDialog().prompt({
                                label: _t("codedlg.whatname","What's your name?"),
                                value: mainForm.getFieldValue("yourname"),
                                onClose: (action,value) => {if(action==Dialog.OK)mainForm.setFieldValue("yourname",value)}
                            })}>Enter your name</Button>
                        <Button bsStyle="primary" onClick={()=>
                            mainForm.getDialog().picker({
                                label: _t("codedlg.selectname","Select your name"),
                                value: mainForm.getFieldValue("yourname"),
                                onClose: (action,value) => {if(action==Dialog.OK)mainForm.setFieldValue("yourname",value)},
                                picker: (
                                        <ListPicker
                                            title={_t("codedlg.choosename","Choose a name")}
                                            values={["Phil", "John", "Robert"]}
                                            />
                                    )
                            })}>Pick your name</Button>
                            <Button bsStyle="primary" onClick={()=>
                                mainForm.getDialog().picker({
                                    label: _t("codedlg.selectname","Select your name"),
                                    value: mainForm.getFieldValue("yourname"),
                                    onClose: (action,value) => {if(action==Dialog.OK)mainForm.setFieldValue("yourname",value)},
                                    picker: (
                                        <ListPicker
                                            title={_t("codedlg.choosename","Choose a name")}
                                            values={
                                                new Jsql()
                                                    .database(Constants.DATABASE)
                                                    .query("SELECT $.firstname name FROM _default ORDER BY name")
                                                    .format('value')
                                                    .fetch()                                                    
                                            }
                                        />
                                    )
                                })}>Select from the database</Button>
                    </ButtonToolbar>
                    <Field name="yourname" component={renderText} readOnly={true}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <ControlLabel>Pickup multiple values</ControlLabel>
                    <ButtonToolbar>
                        <Button bsStyle="primary" onClick={()=>
                            mainForm.getDialog().picker({
                                multiple: true,
                                label: _t("codedlg.selectnames","Select your names"),
                                value: mainForm.getFieldValue("yournames"),
                                onClose: (action,value) => {if(action==Dialog.OK)mainForm.setFieldValue("yournames",value)},
                                picker: (
                                        <ListPicker
                                            multiple={true}
                                            title={_t("codedlg.choosenames","Choose names")}
                                            values={["Phil", "John", "Robert"]}
                                            />
                                    )
                            })}>Pick your name</Button>
                            <Button bsStyle="primary" onClick={()=>
                                mainForm.getDialog().picker({
                                    multiple: true,
                                    label: _t("codedlg.selectnames","Select your names"),
                                    value: mainForm.getFieldValue("yournames"),
                                    onClose: (action,value) => {if(action==Dialog.OK)mainForm.setFieldValue("yournames",value)},
                                    picker: (
                                        <ListPicker
                                            title={_t("codedlg.choosenames","Choose names")}
                                            values={
                                                new Jsql()
                                                    .database(Constants.DATABASE)
                                                    .query("SELECT $.firstname name FROM _default ORDER BY name")
                                                    .format('value')
                                                    .fetch()                                                    
                                            }
                                        />
                                    )
                                })}>{_t("codedlg.selectfromdb","Select from the database")}</Button>
                    </ButtonToolbar>
                    <Field name="yournames" multiple={true} component={renderText} readOnly={true}/>
                </div>
            </fieldset>
        </div>
        );
    }
}

export default CodeMessages