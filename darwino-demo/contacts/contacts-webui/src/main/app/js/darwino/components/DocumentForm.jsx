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

import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { Field, reduxForm, initialize, change } from 'redux-form';
import { Link } from "react-router";
import { FormControl, FormGroup, ControlLabel } from 'react-bootstrap';
import { darwinoToStoreKey, updateDocument, createDocument, loadDocument, newDocument, deleteDocument, removeDocument } from "../../darwino/actions/jsonStoreActions.jsx";


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
        const { documents } = state;
        if(ownProps.match.params && ownProps.match.params.unid) {
            const storeKey = darwinoToStoreKey(databaseId, storeId,  ownProps.match.params.unid);
            const doc = documents[storeKey];

            return {
                databaseId,
                storeId,
                doc,
                newDoc: false,
                initialValues: doc ? doc.json : null,
                ownProps
            }
        } else {
            return {
                databaseId,
                storeId,
                doc: {},
                newDoc: true,
                ownProps
            }
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
    }
    
    componentWillMount() {
        const { databaseId, storeId, loadDocument, newDocument, newDoc, match } = this.props;

        // Load the initial values
        // We could also call newDocument is we want to call the service to get the
        // document initialized
        if(!newDoc) {
            loadDocument(databaseId, storeId, match.params.unid);
        }
    }

    componentWillUnmount() {
        const { databaseId, storeId, newDoc, match } = this.props;
        // Remove the document from the state
        if(!newDoc) {
            removeDocument(databaseId, storeId, match.params.unid);
        }
    }

    handleUpdateDocument(state, dispatch) {
        const { databaseId, storeId, createDocument, updateDocument, newDoc, doc, match } = this.props;
        let promise;
        if(newDoc) {
            promise = createDocument(databaseId, storeId, {
                ...state
            },state.name);
        } else {
            promise = updateDocument(databaseId, storeId, match.params.unid, {
                ...doc.json,
                ...state
            })
        }

        promise.then(() => {
            if(this.props.nextPageSuccess) {
                this.context.router.history.push(this.props.nextPageSuccess);
            }
        }, () => {
            if(this.props.nextPageError) {
                this.context.router.history.push(this.props.nextPageError);
            }
        });
    }

    handleDeleteDocument(state, dispatch) {
        if(!confirm("This will delete the document.\nDo you want to continue?")) {
            return;
        }

        const { databaseId, storeId, deleteDocument, match } = this.props;

        deleteDocument(databaseId, storeId, match.params.unid).then(() => {
            if(this.props.nextPageSuccess) {
                this.context.router.history.push(this.props.nextPageSuccess);
            }
        }, () => {
            if(this.props.nextPageError) {
                this.context.router.history.push(this.props.nextPageError);
            }
        });
    }
}

export default DocumentForm
