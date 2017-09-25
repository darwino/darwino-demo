/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React, {Component} from "react";
import { Field } from 'redux-form';
import { Button, ButtonToolbar, ControlLabel } from 'react-bootstrap';
import { Jsql } from '@darwino/darwino';
import { ListPicker, Dialog, renderText } from '@darwino/darwino-react-bootstrap';

import Constants from "../Constants.jsx";

class CodeMessages extends Component {

    render() {
        const {mainForm} = this.props;
        return (
            <div className="col-md-12 col-sm-12">
                <fieldset>
                <div className="col-md-12 col-sm-12">
                    <ControlLabel>Alert Box</ControlLabel>
                    <p>
                        Equivalent to javascript alert()
                    </p>
                    <ButtonToolbar>
                        <Button bsStyle="primary" onClick={()=>
                            mainForm.getDialog().alert({message:"You clicked me!"})
                        }>Simple Alert</Button>
                        <Button bsStyle="primary" onClick={()=>
                            mainForm.getDialog().alert({
                                message:"You clicked me!",
                                onClose:(action,value) => alert("I confirm, you clicked it")
                            })}>Alert with Notification</Button>
                    </ButtonToolbar>
                </div>
                <div className="col-md-12 col-sm-12">
                    <ControlLabel>Ask for a confirmation</ControlLabel>
                    <p>
                        Equivalent to javascript confirm()
                    </p>
                    <ButtonToolbar>
                        <Button bsStyle="primary" onClick={()=>
                            mainForm.getDialog().okCancel({
                                message:"Click Ok or Cancel my friend",
                                onClose:(action,value) => alert("You clicked "+(action?"Ok":"Cancel"))
                            })}>Confirm, Ok/Cancel</Button>
                        <Button bsStyle="primary" onClick={()=>mainForm.getDialog().yesNo({
                                message:"Click Yes or No my friend",
                                onClose:(action,value) => alert("You clicked "+(action==Dialog.YES?"Yes":"No"))
                            })}>Confirm, Yes/No</Button>
                    </ButtonToolbar>
                </div>
                <div className="col-md-12 col-sm-12">
                    <ControlLabel>Prompt for a value</ControlLabel>
                    <p>
                        Equivalent to javascript prompt()
                    </p>
                    <ButtonToolbar>
                        <Button bsStyle="primary" onClick={()=>
                            mainForm.getDialog().prompt({
                                label: "What's your name?",
                                value: mainForm.getFieldValue("yourname"),
                                onClose: (action,value) => {if(action==Dialog.OK)mainForm.setFieldValue("yourname",value)}
                            })}>Enter your name</Button>
                        <Button bsStyle="primary" onClick={()=>
                            mainForm.getDialog().picker({
                                label: "Select your name",
                                value: mainForm.getFieldValue("yourname"),
                                onClose: (action,value) => {if(action==Dialog.OK)mainForm.setFieldValue("yourname",value)},
                                picker: (
                                        <ListPicker
                                            title="Choose a name" 
                                            values={["Phil", "John", "Robert"]}
                                            />
                                    )
                            })}>Pick your name</Button>
                            <Button bsStyle="primary" onClick={()=>
                                mainForm.getDialog().picker({
                                    label: "Select your name",
                                    value: mainForm.getFieldValue("yourname"),
                                    onClose: (action,value) => {if(action==Dialog.OK)mainForm.setFieldValue("yourname",value)},
                                    picker: (
                                        <ListPicker
                                            title="Choose a name" 
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
                                label: "Select your names",
                                value: mainForm.getFieldValue("yournames"),
                                onClose: (action,value) => {if(action==Dialog.OK)mainForm.setFieldValue("yournames",value)},
                                picker: (
                                        <ListPicker
                                            multiple={true}
                                            title="Choose names" 
                                            values={["Phil", "John", "Robert"]}
                                            />
                                    )
                            })}>Pick your name</Button>
                            <Button bsStyle="primary" onClick={()=>
                                mainForm.getDialog().picker({
                                    multiple: true,
                                    label: "Select your names",
                                    value: mainForm.getFieldValue("yournames"),
                                    onClose: (action,value) => {if(action==Dialog.OK)mainForm.setFieldValue("yournames",value)},
                                    picker: (
                                        <ListPicker
                                            title="Choose names" 
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
                    <Field name="yournames" multiple={true} component={renderText} readOnly={true}/>
                </div>
            </fieldset>
        </div>
        );
    }
}

export default CodeMessages