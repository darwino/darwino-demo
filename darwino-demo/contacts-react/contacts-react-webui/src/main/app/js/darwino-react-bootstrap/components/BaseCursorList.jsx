/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router";
import DEV_OPTIONS from '../../darwino-react/util/dev';
import JstoreCursor from '../../darwino-react/jstore/cursor';
import EmptyDataFetcher from '../../darwino-react/data/EmptyDataFetcher';
import PagingDataFetcher from '../../darwino-react/data/PagingDataFetcher';
import ArrayDataFetcher from '../../darwino-react/data/ArrayDataFetcher';

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
        this.loadMoreRows = this.loadMoreRows.bind(this);
    }

    loadMoreRows() {
        return this.dataFetcher.loadMoreRows();
    }

    componentWillMount() {
        let dataLoader = this.createDataLoader();
        this.dataFetcher = this.createDataFetcher(dataLoader);
        this.dataFetcher.init();
    }
    createDataLoader() {
        const { databaseId, storeId, params } = this.props;
        return (new JstoreCursor())
            .database(databaseId)
            .store(storeId)
            .queryParams(params)
            .getDataLoader();
    }
    createDataFetcher(dataLoader) {
        return this.createArrayDataFetcher(dataLoader);
    }
    createPagingDataFetcher(dataLoader) {
        return new PagingDataFetcher({
            dataLoader,
            autoFetch: true,
            onDataLoaded: () => {this.forceUpdate()},
            ...this.props.dataFetcher
        })
    }
    createArrayDataFetcher(dataLoader) {
        return new ArrayDataFetcher({
            dataLoader,
            onDataLoaded: () => {this.forceUpdate()},
            ...this.props.dataFetcher
        })
    }

    clearEntries() {
        this.setPage(0);
    }

    setPage(page) {
        this.dataFetcher.firstPage = page*this.props.pageSize;
        this.dataFetcher.init();
    }

    getDataFetcher() {
        return this.dataFetcher;
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
