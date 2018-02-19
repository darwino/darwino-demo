/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React, {Component} from "react";

import { Field } from 'redux-form';
import {  _t } from '@darwino/darwino';
import { renderText, renderTextArea, renderStatic, renderDatePicker } from '@darwino/darwino-react-bootstrap';

class AllFieldsText extends Component {

    render() {
        const {mainForm} = this.props;
        const readOnly = mainForm.isReadOnly();
        const disabled = mainForm.isDisabled();
        return (
            <fieldset>
                <div className="col-md-12 col-sm-12">
                    <Field name="SimpleInput" component={renderText} label={_t("aftext.simpinp","Simple Input")} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="SimpleInput" component={renderText} label={_t("aftext.simpinpro","Simple Input - Read only")} readOnly={true} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="SimpleInput" component={renderText} label={_t("aftext.simpinpnoted","Simple Input - Not editable")} editable={false} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="SimpleInput" component={renderText} label={_t("aftext.simpdis","Simple Input - disabled")} disabled={true} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="SimpleInput" type="password" component={renderText} label={_t("aftext.simppwd","Simple Input - password")} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="SimpleInput" component={renderStatic} label={_t("aftext.static","Static Text")} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="TextArea" component={renderTextArea} label={_t("aftext.textarea","Text Area")} rows={4} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="DatePicker" component={renderDatePicker} label={_t("aftext.datepick","Date Picker")} disabled={disabled} readOnly={readOnly}/>
                </div>
            </fieldset>
        );
    }
}

export default AllFieldsText