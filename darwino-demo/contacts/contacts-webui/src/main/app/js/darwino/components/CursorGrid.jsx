/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2018.
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
