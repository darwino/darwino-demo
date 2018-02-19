/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React, {Component} from "react";

import { Field } from 'redux-form';
import {  _t } from '@darwino/darwino';
import { renderRichText, renderAttachments } from '@darwino/darwino-react-bootstrap';

class AllFieldsRichText extends Component {

    render() {
        const {mainForm} = this.props;
        const readOnly = mainForm.isReadOnly();
        const disabled = mainForm.isDisabled();
        return (
            <fieldset>
                <div className="col-md-12 col-sm-12">
                    <Field name="richtext" component={renderRichText} label={_t("africhtext.somert","Some rich text")} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="__attachments" colLength={false} component={renderAttachments} label={_t("africhtext.att","Attachments")} buttonLabel={_t("africhtext.addfile","Add a New File...")} disabled={disabled} readOnly={readOnly}
                        onUpload={(att) => {
                            console.log("Attachment Upload: "+att.name+", "+att.length);
                            let ok = att.length<1024*1024;
                            if(!ok) {
                                alert(_t("africhtext.attsize","Attachment is greater than 1M and cannot be uploaded"));
                            }
                            return ok;
                        }}
                        onDelete={(att) => {console.log("Attachment Delete: "+att.name);return true;}}
                    />
                </div>
            </fieldset>
        );
    }
}

export default AllFieldsRichText