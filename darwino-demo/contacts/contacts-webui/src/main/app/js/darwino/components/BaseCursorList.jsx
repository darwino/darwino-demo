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
import PropTypes from 'prop-types';
import { Link } from "react-router";
import DEV_OPTIONS from '../util/dev';
import JstoreCursor from '../jstore/cursor';

const DEFAULT_PAGE_SIZE = 50;

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
export class BaseCursorList extends Component {
    static contextTypes = {
        router: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleDeleteAllDocuments = this.handleDeleteAllDocuments.bind(this);
        this.getViewEntryCells = this.getViewEntryCells.bind(this);
        this.hasMoreRows = this.hasMoreRows.bind(this);
        this.addRows = this.addRows.bind(this);

        this.state = {
            page: 0,
            pageSize: props.pageSize || DEFAULT_PAGE_SIZE,
            moreRows: true,
            fetching: false,
            error: null,
            entries: []
        }
    }

    componentWillMount() {
        this.setPage(0)
    }

    clearEntries() {
        this.setState({
            page: 0,
            moreRows: true,
            fetching: false,
            error: null,
            entries: []
        })
    }

    handleError(error) {
        console.log("Error, "+error);
        let msg = error.toString() // entries.toString()+"\n"+JSON.stringify(entries,null,2)
        this.setState({
            fetching: false,
            error: msg
        })
    }

    setPage(page) {
        const { databaseId, storeId, params } = this.props;
        (new JstoreCursor())
            .database(databaseId)
            .store(storeId)
            .queryParams(params)
            .skip(page*this.state.pageSize)
            .limit(this.state.pageSize)
            .fetchEntries().then(entries => {
                this.setState({
                    page: page,
                    fetching: false,
                    moreRows: entries.length==this.state.pageSize,
                    error: null,
                    entries: entries
                })
            }, error => {
                this.handleError(error)
            }
        );
        this.setState({
            fetching: true
        })
    }

    addRows() {
        if(!this.state.fetching && this.hasMoreRows()) {
            const { databaseId, storeId, params } = this.props;
            (new JstoreCursor())
                .database(databaseId)
                .store(storeId)
                .queryParams(params)
                .skip(this.state.page*this.state.pageSize+this.state.entries.length)
                .limit(this.state.pageSize)
                .fetchEntries().then(entries => {
                    this.setState({
                        fetching: false,
                        moreRows: entries.length==this.state.pageSize,
                        error: null,
                        entries: this.state.entries.concat(entries)
                    })
                }, error => {
                    handleError(error)
                }
            );
            this.setState({
                fetching: true
            })
        }
    }

    hasMoreRows() {
        return this.state.moreRows;
    }

    isFetching() {
        return this.state.fetching;
    }

    getErrorMessage() {
        return this.state.error;
    }

    handleRowClick(entry) {
        const { baseRoute } = this.props;
        if(!baseRoute) {
            return;
        }
        // https://stackoverflow.com/questions/42701129/how-to-push-to-history-in-react-router-v4
        this.context.router.history.push(baseRoute + '/' + entry.unid);
    }
    handleDeleteAllDocuments() {
        const { databaseId, storeId, params, deleteAllDocuments, loadStoreEntries } = this.props;
        if(!confirm("This will delete all the documents from this view.\nDo you want to continue?")) {
            return;
        }
        fetch(`${DEV_OPTIONS.serverPrefix}$darwino-jstore/databases/${encodeURIComponent(databaseId)}/stores/${encodeURIComponent(storeId)}/documents`, {
            credentials: DEV_OPTIONS.credentials,
            method: 'DELETE'
        }).then(doc => {
            this.clearEntries();
            this.setPage(0);
        })
    }
}

export default BaseCursorList
