/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc. 2014-2017.
 *
 * Notice: The information contained in the source code for these files is the property 
 * of Darwino Inc. which, with its licensors, if any, owns all the intellectual property 
 * rights, including all copyright rights thereto.  Such information may only be used 
 * for debugging, troubleshooting and informational purposes.  All other uses of this information, 
 * including any production or commercial uses, are prohibited. 
 */

import React, { Component } from "react";
import { connect } from 'react-redux'
import { Field, reduxForm, initialize, change } from 'redux-form';
import { Link } from "react-router";
import { FormControl, FormGroup, ControlLabel } from 'react-bootstrap';
import { darwinoToStoreKey, updateDocument, createDocument, loadDocument, newDocument, deleteDocument, removeDocument } from "../../darwino/actions/jsonStoreActions.jsx";


/*
 * Document attachment table.
 */
export class AttachmentTable extends Component {

    constructor(props) {
        super(props);

        this.renderAttachmentTable = this.renderAttachmentTable.bind(this);
        this.renderAttachmentRows = this.renderAttachmentRows.bind(this);
        this.cleanAttachmentName = this.cleanAttachmentName.bind(this);
    }

    render() {
        if(doc && doc.attachments) {
            return null;
        }

        return (<table className="table table-condensed table-striped table-bordered table-attachments">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Size</th>
                    <th>Type</th>
                </tr>
            </thead>
            <tbody>
                {this.renderAttachmentRows(this.attachmentsForField(doc.attachments, field), doc.unid)}
            </tbody>
        </table>)
    }

    attachmentsForField(attachments, field) {
        return attachments.filter(att => att.name.toLowerCase().indexOf(field+"^^") == 0);
    }

    renderAttachmentRows(attachments, unid) {
        const { databaseId, storeId } = this.props;
        return attachments.map(att => {
            return (<tr key={att.name}>
                    <td><a href={this.renderAttachmentUrl(databaseId, storeId, unid, att.name)} target="_blank">{this.cleanAttachmentName(att.name)}</a></td>
                    <td>{att.length}</td>
                    <td>{att.mimeType}</td>
                </tr>
            )
        })
    }

    cleanAttachmentName(name) {
        if(!name) { return "" }
        const inlineIndex = name.indexOf("||");
        if(inlineIndex > -1) {
            return name.substring(inlineIndex+2);
        }
        const attIndex = name.indexOf("^^");
        if(attIndex > -1) {
            return name.substring(attIndex+2);
        }
        return name;
    }

    renderAttachmentUrl(databaseId, storeId, unid, name) {
        return `$darwino-jstore/databases/${encodeURIComponent(databaseId)}/stores/${encodeURIComponent(storeId)}/` +
                `documents/${encodeURIComponent(unid)}/attachments/${encodeURIComponent(name)}`;
    }
}

export default AttachmentTable
