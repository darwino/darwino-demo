/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2017.
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

import React, { Component } from "react";
import { connect } from 'react-redux'
import { Field, reduxForm, initialize, change } from 'redux-form';
import { Link } from "react-router";
import { darwinoToStoreKey, updateDocument, createDocument, loadDocument, newDocument, deleteDocument, removeDocument } from "../../darwino-react/actions/jsonStoreActions.jsx";


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
