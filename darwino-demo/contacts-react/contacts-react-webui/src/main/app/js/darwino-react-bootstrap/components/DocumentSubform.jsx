/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React, { Component } from "react";
import { FormSection } from 'redux-form';

/*
 *
 */
export class DocumentSubform extends FormSection {

    componentWillMount() {
        if(this.props.documentForm) {
            this.props.documentForm._registerSubform(this)
        }
    }

    componentWillUnmount() {
        if(this.props.documentForm) {
            this.props.documentForm._unregisterSubform(this)
        }
    }

    getFieldValue(field) {
        // Should use the name as the path prefix!
        if(this.props.documentForm) {
            this.props.documentForm.getFieldValue(field)
        }
        return undefined
    }
}

export default DocumentSubform
