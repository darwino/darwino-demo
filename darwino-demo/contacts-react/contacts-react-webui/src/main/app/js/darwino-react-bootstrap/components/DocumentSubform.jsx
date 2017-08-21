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

    getDocument() {
        // Should use the name as the path prefix!
        if(this.props.documentForm) {
            return this.props.documentForm.getDocument();
        }
        return undefined
    }

    getFieldValue(field) {
        // Should use the name as the path prefix!
        if(this.props.documentForm) {
            this.props.documentForm.getFieldValue(field)
        }
        return undefined
    }

    setFieldValue(field,value) {
        // Should use the name as the path prefix!
        if(this.props.documentForm) {
            this.props.documentForm.setFieldValue(field,value)
        }
    }
}

export default DocumentSubform
