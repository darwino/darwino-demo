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
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { Field, reduxForm, initialize, change } from 'redux-form';
import { Link } from "react-router";
import { darwinoToStoreKey, updateDocument, createDocument, loadDocument, newDocument, deleteDocument, removeDocument } from "../../darwino-react/actions/jsonStoreActions.jsx";


/*
 * Expected properties:
 * - databaseId (string)
 * - storeId (string)
 * - unid (string)
 */
export class DocumentForm extends Component {
    static contextTypes = {
        router: PropTypes.object
    };

    // Default mapStateToProps
    static mapStateToProps = function(state, ownProps, databaseId, storeId) {
        const unid = (ownProps.match.params && ownProps.match.params.unid) || null;
        const storeKey = darwinoToStoreKey(databaseId, storeId, unid);
        const newDoc = !unid; // Might use a different system to allow new documents with a predefined unid
        const doc = state.documents[storeKey] || {json:{}};
        return {
            databaseId,
            storeId,
            unid,
            doc,
            newDoc,
            ownProps,
            initialValues: doc.json
        }
    }

    // Default mapDispatchProps
    static mapDispatchToProps = { 
        updateDocument, 
        createDocument, 
        loadDocument, 
        newDocument, 
        deleteDocument,
        removeDocument
    };

    constructor(props) {
        super(props);

        this.handleUpdateDocument = this.handleUpdateDocument.bind(this);
        this.handleDeleteDocument = this.handleDeleteDocument.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.docEvents = {
            initialize: this.initialize.bind(this),
            prepareForDisplay: this.prepareForDisplay.bind(this),
            prepareForSave: this.prepareForSave.bind(this)
        }
    }

    // Default event handlers
    initialize(doc) {}
    prepareForDisplay(doc) {}
    prepareForSave(doc) {return doc.json;}
    
    componentWillMount() {
        const { databaseId, storeId, unid, docEvents, loadDocument, newDocument, newDoc } = this.props;

        // Load the initial values
        // We could also call newDocument is we want to call the service to get the
        // document initialized
        if(newDoc) {
            newDocument(databaseId, storeId, unid, false, this.docEvents);
        } else {
            loadDocument(databaseId, storeId, unid, this.docEvents);
        }
    }

    componentWillUnmount() {
        const { databaseId, storeId, unid, newDoc} = this.props;
        // Remove the document from the state
        if(!newDoc) {
            removeDocument(databaseId, storeId, unid, this.docEvents);
        }
    }

    handleUpdateDocument(state, dispatch) {
        const { databaseId, storeId, unid, createDocument, updateDocument, newDoc, doc } = this.props;
        let promise;
        if(newDoc) {
            promise = createDocument(databaseId, storeId, unid, {
                ...state
            },this.docEvents);
        } else {
            promise = updateDocument(databaseId, storeId, unid, {
                ...doc.json,
                ...state
            }, this.docEvents)
        }

        promise.then(() => {
            if(this.props.nextPageSuccess) {
       			this.props.reset();
                this.context.router.history.push(this.props.nextPageSuccess);
            }
        }, () => {
            if(this.props.nextPageError) {
       			this.props.reset();
                this.context.router.history.push(this.props.nextPageError);
            }
        });
    }

    handleDeleteDocument(state, dispatch) {
        if(!confirm("This will delete the document.\nDo you want to continue?")) {
            return;
        }

        const { databaseId, storeId, unid, deleteDocument } = this.props;

        deleteDocument(databaseId, storeId, unid).then(() => {
            if(this.props.nextPageSuccess) {
                this.context.router.history.push(this.props.nextPageSuccess);
            }
        }, () => {
            if(this.props.nextPageError) {
                this.context.router.history.push(this.props.nextPageError);
            }
        });
    }

    handleCancel(state, dispatch) {
        if(this.props.nextPageSuccess) {
            this.props.reset()
            this.context.router.history.push(this.props.nextPageSuccess);
        } 
    }
}

export default DocumentForm
