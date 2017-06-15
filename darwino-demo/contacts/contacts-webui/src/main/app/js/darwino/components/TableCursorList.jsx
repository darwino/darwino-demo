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
import { Link } from "react-router-dom";
import BaseCursorList from './BaseCursorList.jsx';

/*
 * Expected properties:
 * - databaseId (string)
 * - storeId (string)
 * - params (object)
 * - columns (array of objects (title/key))
 * - baseRoute (string)
 * - createButtonText (string)
 * - deleteAllButtonText (string)
 * 
 * Note: 'store' is a reserved prop with redux so the parameter is 'storeId', and 'databaseId' for consistency.
 */
export class TableCursorList extends BaseCursorList {

    constructor(props) {
        super(props);
    }

    getViewEntries() {
        const { entries } = this.state;
        const { columns } = this.props;

        if(this.isFetching()) {
            return (<tr><td colSpan={columns.length}>Fetching...</td></tr>);
        } if(this.getErrorMessage()) {
            return (<tr><td colSpan={columns.length}><pre>Error: {this.getErrorMessage()}</pre></td></tr>);
        } else if(Array.isArray(entries)) {
            if(entries.length==0) {
                return (<tr><td colSpan={columns.length}>No entries found</td></tr>)
            } else {
                return entries.slice(0, this.state.rowCount).map((entry, index) =>
                    <tr key={entry.unid} onClick={() => this.handleRowClick(entry)}>
                        {this.getViewEntryCells(entry)}
                    </tr>)
            }
        }
    }
    getViewEntryCells(entry) {
        const { columns } = this.props;
        return columns.map(col =>
            <td key={entry.unid+col.key}>{entry.value[col.key]}</td>
        );
    }

    createActionBar() {
        return (
            <div className="action-bar">
                {this.getCreateButton()}
                {this.getDeleteAllButton()}
            </div>
        );
    }

    getCreateButton() {
        const { createButtonText, baseRoute } = this.props;
        if(!createButtonText || !baseRoute) {
            return null
        } else {
            return (
                <Link to={`${baseRoute}`} className="btn btn-primary">{createButtonText}</Link>
            )
        }
    }

    getDeleteAllButton() {
        const { deleteAllButtonText } = this.props;
        if(!deleteAllButtonText) {
            return null
        } else {
            return (
                <div className="pull-right">
                    <button onClick={this.handleDeleteAllDocuments} className="btn btn-danger">{deleteAllButtonText}</button>
                </div>
            )
        }
    }

    getAddRowsButton() {
        const { addRowsButtonText } = this.props;
        if(!addRowsButtonText) {
            return null
        } else {
            return (
                <button style={this.hasMoreRows() ? {} : {display: 'none'}} onClick={this.addRows}>{addRowsButtonText}}</button>
            )
        }
    }
    
    render() {
        const { viewEntries, columns } = this.props;
        
        return (
            <div>
                {this.createActionBar()}
                <div className="table-responsive">
                    <table className="table table-striped table-condensed table-bordered table-hover darwino-view">
                        <thead>
                            <tr>
                                {columns.map(col => <th key={col.key}>{col.title}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {this.getViewEntries()}
                        </tbody>
                    </table>
                    {this.getAddRowsButton()}
                </div>
            </div>
        );
  }
}

export default TableCursorList
