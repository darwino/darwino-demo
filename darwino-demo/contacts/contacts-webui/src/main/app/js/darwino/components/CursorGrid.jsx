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
import PropTypes from 'prop-types';

import ReactDataGrid from 'react-data-grid';
import JstoreCursor from '../jstore/cursor';
import PagingDataFetcher from '../util/PagingDataFetcher';


/*
 * Data Grid diplaying the result of a cursor
 */
export class CursorGrid extends Component {
    static contextTypes = {
        router: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.rowGetter = this.rowGetter.bind(this);
    }

    componentWillMount() {
        let dataLoader = null
        const { databaseId, storeId, params } = this.props;
        if(databaseId) {
            dataLoader = (new JstoreCursor())
                .database(databaseId)
                .store(storeId)
                .queryParams(params)
                .getDataLoader();
        }
        this.dataFetcher = new PagingDataFetcher({
            dataLoader,
            autoScroll: true,
            onPageLoaded: () => {this.forceUpdate()},
            ...this.props.dataFetcher
        })
        this.dataFetcher.init();
    }

    handleRowClick(entry) {
        const { baseRoute } = this.props;
        if(!baseRoute) {
            return;
        }
        // https://stackoverflow.com/questions/42701129/how-to-push-to-history-in-react-router-v4
        this.context.router.history.push(baseRoute + '/' + entry.__meta.unid);
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
    
    rowGetter(i) {
        return this.dataFetcher.getRow(i);
    }
    rowsCount() {
        return this.dataFetcher.getRowCount();
    }

    render() {
        return  (
            <div>
                {this.createActionBar()}
                <ReactDataGrid
                    rowGetter={this.rowGetter}
                    rowsCount={this.rowsCount()}
                    minHeight={500}
                    onRowClick={(idx,data) => {
                        this.handleRowClick(data)
                    }}
                    {...this.props.grid}                
                />
            </div>
        );
    }    
}

export default CursorGrid
