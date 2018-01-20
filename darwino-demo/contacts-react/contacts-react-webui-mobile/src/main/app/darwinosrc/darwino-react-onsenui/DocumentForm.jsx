/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { BaseDocumentForm } from "@darwino/darwino-react";
import MainPageMixin from "./MainPageMixin"
    
/*
 *
 */
class DocumentForm extends MainPageMixin(BaseDocumentForm) {

    // Context to read from the parent - navigator
    static contextTypes = {
        navigator: PropTypes.object
    };
    
    constructor(props,context) {
        super(props,context)
    }

    gotoNextPage() {
        const page = this.props.nextPageSuccess;
        if(page) {
            this.context.navigator.pushPage(page);
        } else {
            this.context.navigator.popPage();
        }
    }
    
}

export default DocumentForm
