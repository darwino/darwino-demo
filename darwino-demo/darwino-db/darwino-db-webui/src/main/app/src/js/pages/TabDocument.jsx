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
import { Form, Tab, Button } from 'react-bootstrap';
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form';

import {DocumentForm,Messages,renderText,renderAttachments} from '@darwino/darwino-react-bootstrap';
import {stringifySorted} from '../utils/jsonutils'
import MaterialDesignTabs from '../components/MaterialDesignTabs';
import renderCodeEditor from '../components/renderCodeEditor';

const FORM_NAME = "jsoneditor";


class TabDocument extends DocumentForm {

  // Convert the whole document content as a 'json' property into the document
  // This property must be the only one to be edited going forward
  prepareForDisplay(values) {
    const {__attachments, ...v} = values
    const json = stringifySorted(v);
    values.__unid = this.state.unid;
    values.__storeId = this.state.storeId;
    values.__json = json;
  }

  // Read back the JSON property as text and set its content to the values parameters
  // 'values' is a temporary object that will be saved to the database
  prepareForSave(values) {
      const json = values.__json ? JSON.parse(values.__json) : {}
      // Delete all props from values & assign the new JSON
      for (var p in values) if (values.hasOwnProperty(p)) delete values[p];
      Object.assign(values,json)
  }
  getNewDocIds(values) {
    return {databaseId: this.state.databaseId, storeId: values.__storeId, unid: values.__unid };
  }

  validate(values) {
    const errors = {};

    // Should we validate the UNID?

    const json = values.__json;
    if(json) {
        try {
            JSON.parse(json);
        } catch (e) {
            errors.__json = "Invalid JSON value: "+json;
        }
    }
    return errors;
  }

  postSave(success,error) {
    this.getMessages().clear();
    if(success) {
      this.getMessages().add({key:"0",title:"Update Success",message:"",type: Messages.SUCCESS})
    } else {
      this.getMessages().add({key:"0",title:"Update Error",message:error,type: Messages.ERROR})
    }
  }

  postDelete() {
    this.getMessages().clear();
    this.getMessages().add({key:"0",title:"Document Sucessfully Deleted",message:"",type: Messages.SUCCESS})
    this.setState({
      deleted: true
    })
  }


  render() {
    // How to display an error when read from the service?
    // Does the same form support multiple instances? 
    const { newDoc } = this.state;
    const { handleSubmit, invalid, submitting } = this.props;
    const readOnly = this.isReadOnly();
    const disabled = this.isDisabled();

    return (
      <div>
        {this.createMessages()}
        {!this.state.deleted && (
        <Form onSubmit={handleSubmit(this.handleUpdateDocument)}>
          <h5>
            Database: <span>{this.state.databaseId}, </span> 
            Store: <span>{this.state.storeId || '<empty>'}, </span> 
            Document: <span>{this.state.unid || '<new document>'}</span> 
          </h5>
          <div>
            <div style={(disabled||readOnly) ? {display: 'none'} : {}}>
              <div className="pull-right">
                <Button onClick={this.delete} bsStyle="danger" disabled={submitting} style={newDoc ? {display: 'none'} : {}}>{"Delete"}</Button>
              </div>
              <Button bsStyle="primary" type="submit" disabled={invalid||submitting}>{"Save"}</Button>
            </div>
          </div>

          <MaterialDesignTabs defaultActiveKey={1} id="uncontrolled-tab-example">
            <Tab eventKey={1} title="Data">
              <legend>{"Company As JSON"}</legend>

              { !this.state.storeId && (
                <div className="col-md-12 col-sm-12">
                  <Field name="__storeId" type="text" label="Store" component={renderText} disabled={disabled||!newDoc}/>
                </div>              
              )}
              <div className="col-md-12 col-sm-12">
                <Field name="__unid" type="text" label="UNID" component={renderText} disabled={disabled||!newDoc}/>
              </div>              
              <div className="col-md-12 col-sm-12">
                <Field name="__json" type="text" label={"JSON"} rows={15} mode="json" wrapEnabled={true} component={renderCodeEditor} disabled={disabled} readOnly={readOnly} style={{width: '100%'}}/>
              </div>
            </Tab>
            <Tab eventKey={2} title="Attachments">
              <Field name="__attachments" type="text" component={renderAttachments} label="Attachments" disabled={disabled} readOnly={readOnly}/>
            </Tab>
          </MaterialDesignTabs>
        </Form>
        )}
      </div>
    );
  }
}


const form = reduxForm({
  form: FORM_NAME,
  validate: DocumentForm.validateForm,
  onChange: DocumentForm.onChange
});

export default  
  connect(null,DocumentForm.mapDispatchToProps)
    (form(TabDocument))
