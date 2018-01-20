/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React, {Component} from "react";
import PropTypes from 'prop-types';

import { EmptyDataFetcher, PagingDataFetcher } from '@darwino/darwino';
import { BaseCursorList } from '@darwino/darwino-react';

class CursorList extends BaseCursorList {

    // Context to read from the parent - navigator
    static contextTypes = {
        navigator: PropTypes.object
    };
    
    constructor(props,context) {
        super(props,context);
    }

    createDataFetcher(dataLoader) {
        if(!dataLoader) return new EmptyDataFetcher();
        return this.createPagingDataFetcher(dataLoader);
    }
    createPagingDataFetcher(dataLoader) {
        return new PagingDataFetcher({
            dataLoader,
            autoFetch: false,
            onDataLoaded: () => {this.forceUpdate()},
            ...this.props.dataFetcher
        })
    }
}

export default CursorList
