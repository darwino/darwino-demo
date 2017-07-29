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


function _event(clazz,method,values,props,exprops,result) {
    let c = clazz.formEvents
    if(c) {
        var p = exprops ? {...props,...exprops} : props
        if(c[method]) { 
            Object.assign(result,c[method](values,props))
        }
        if(c.delegates) {
            c.delegates.forEach((d)=>{
                let [clazz,props] = Array.isArray(d) ? d : [d]
                _event(clazz,method,values,p,props,result)
            })
        }
    }
    return result;
}


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

    // Default validate
    static validateForm = function(clazz) {
        return function(values,props) {
            return _event(clazz,"validate",values,props,null,{});
        }
    }
    
    // Default mapStateToProps
    static mapStateToProps = function(clazz, databaseId, storeId) {
        return function(state, ownProps) {
            const unid = (ownProps.match.params && ownProps.match.params.unid) || null;
            const storeKey = darwinoToStoreKey(databaseId, storeId, unid);
            const newDoc = !unid; // Might use a different system to allow new documents with a predefined unid
            const doc = state.documents[storeKey] || {json:{}};
            return {
                ...ownProps,
                databaseId,
                storeId,
                unid,
                doc,
                newDoc,
                initialValues: doc.json
            }
        }
    }

    // Default mapDispatchProps
    static mapDispatchToProps = function() {
        return {
            updateDocument, 
            createDocument, 
            loadDocument, 
            newDocument, 
            deleteDocument,
            removeDocument
        }
    };
    
    constructor(props) {
        super(props);

        this.handleUpdateDocument = this.handleUpdateDocument.bind(this);
        this.handleDeleteDocument = this.handleDeleteDocument.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.docEvents = {
            initialize: (values) => {
                _event(this.constructor,"initialize",values,this.props,null,{})
            },
            prepareForDisplay: (values) => {
                _event(this.constructor,"prepareForDisplay",values,this.props,null,{})
            },
            prepareForSave: (values) => {
                _event(this.constructor,"prepareForSave",values,this.props,null,{})
            }
        }
    }
    
    componentWillMount() {
        const { databaseId, storeId, unid, loadDocument, newDocument, newDoc } = this.props;

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
