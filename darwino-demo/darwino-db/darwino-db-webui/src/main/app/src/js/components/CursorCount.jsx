/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";

import { BaseCursorComponent } from '@darwino/darwino-react';

/**
 * Display the count of a query.
 */
class CursorCount extends BaseCursorComponent {

    reinitData() {
        this.createJstoreCursor().fetchCount().then( (count) => {
            this.setState({count});
        });
    }

    render() {
        const {databaseId, storeId, ...props} = this.props; 
        return <span {...props}>{this.state.count!==undefined ? this.state.count : '<calculating...>'}</span>
    }
}

export default CursorCount
