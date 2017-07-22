/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2017.
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
// Is there a better syntax for this?
//import {Data:{Selectors} as Selectors}  from 'react-data-grid-addons';
import {Data}  from 'react-data-grid-addons';
const Selectors = Data.Selectors;
import JstoreCursor from '../../darwino-react/jstore/cursor';
import EmptyDataFetcher from '../../darwino-react/data/EmptyDataFetcher';
import ArrayDataFetcher from '../../darwino-react/data/ArrayDataFetcher';
import PagingDataFetcher from '../../darwino-react/data/PagingDataFetcher';


const  DefaultRowGroupRenderer = (props) => {
    let treeDepth = props.treeDepth || 0;
    let marginLeft = treeDepth * 20;

    let style = {
        //height: '30px',
        border: '1px solid #dddddd',
        paddingTop: '5px',
        paddingBottom: '5px',
        paddingLeft: '5px'
    };

    let onKeyDown = (e) => {
        if (e.key === 'ArrowLeft') {
            props.handleRowExpandToggle(false);
        }
        if (e.key === 'ArrowRight') {
            props.handleRowExpandToggle(true);
        }
        if (e.key === 'Enter') {
            props.handleRowExpandToggle(!props.isExpanded);
        }
    };

    return (
        <div style={style} onKeyDown={onKeyDown} tabIndex={0}>
            <span className="row-expand-icon" style={{float: 'left', marginLeft: marginLeft, cursor: 'pointer'}} onClick={props.onRowExpandClick} >{props.isExpanded ? String.fromCharCode('9660') : String.fromCharCode('9658')}</span>
            <strong>{props.name}</strong>
            </div>
    );
};
/*
 * Data Grid diplaying the result of a cursor
 */
export class CursorGrid extends Component {
    static contextTypes = {
        router: PropTypes.object
    };

    selector = false // React grid add-on Selector

    // Cursor property
    orderBy = null
    descending = false
    ftSearch = null

    constructor(props) {
        super(props);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleGridSort = this.handleGridSort.bind(this);
        this.handleRowExpandToggle = this.handleRowExpandToggle.bind(this);
        this.rowGetter = this.rowGetter.bind(this);
        this.state = {}
        if(props.groupBy) {
            this.state = {
                groupBy: props.groupBy,
                expandedRows: {}
            }
        }
    }

    findColumn(key) {
        const columns = this.props.grid && this.props.grid.columns;
        if(columns) {
            for(let i=0; i<columns.length; i++) {
                if(columns[i].key==key) return columns[i]
            }
        }
        return null;
    }

    componentWillMount() {
        this.reinitData();
    }

    reinitData() {
        let dataLoader = this.createDataLoader();
        if(this.props.groupBy) {
            this.selector = true
            this.dataFetcher = this.createArrayDataFetcher(dataLoader);
        } else {
            this.dataFetcher = this.createPagingDataFetcher(dataLoader);
        }
        this.dataFetcher.init();
    }
    createDataLoader() {
        const { databaseId, storeId, params } = this.props;
        let jsc = new JstoreCursor()
            .database(databaseId)
            .store(storeId)
            .queryParams(params)
        ;
        if(this.orderBy) {
            jsc.orderby(this.orderBy,this.descending)
        }
        if(this.ftSearch) {
            jsc.ftsearch(this.ftSearch)
        }
        return jsc.getDataLoader(entry => {
            return {...entry.json, __meta: entry};
        });            
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
            onDataLoaded: () => {this.setState({rows: this.dataFetcher.getRows()})},
            ...this.props.dataFetcher
        })
    }


    handleRowClick(entry) {
        const { baseRoute } = this.props;
        if(!baseRoute || !entry || !entry.__meta) {
            return;
        }
        if(entry.__meta.category) {
            return;
        }        
        let url = (typeof baseRoute==="function") ? baseRoute(entry) : baseRoute + '/' + entry.__meta.unid;  
        // https://stackoverflow.com/questions/42701129/how-to-push-to-history-in-react-router-v4
        if(url) this.context.router.history.push(url);
    }

    handleRowExpandToggle({ columnGroupName, name, shouldExpand }) {
        let expandedRows = Object.assign({}, this.state.expandedRows);
        expandedRows[columnGroupName] = Object.assign({}, expandedRows[columnGroupName]);
        expandedRows[columnGroupName][name] = {isExpanded: shouldExpand};
        this.setState({expandedRows: expandedRows});
    }

    handleGridSort(sortColumn, sortDirection) {
        let c = this.findColumn(sortColumn);
        if(c && sortDirection!="NONE") {
            this.orderBy = c.sortField||sortColumn
            this.descending = sortDirection=='DESC'
        } else {
            this.orderBy = null
        }
        this.reinitData();
    }

    onSearchChange(evt) {
        this.setState({_ftSearch: evt.target.value});
    }

    createActionBar() {
        return (
            <div className="action-bar">
                {this.getCreateButton()}
                {this.getDeleteAllButton()}
            </div>
        );
    }

    createFTSearchBar() {
        return (
            <form className="navbar-form" role="search" style={{padding: 0}}
                    onSubmit={(evt) => {evt.preventDefault(); this.ftSearch=this._ftSearch; this.reinitData();}}>
                <div className="input-group">
                    <input type="text" className="form-control" size="30" placeholder="Search..." name="q" 
                        onChange={(evt) => this._ftSearch=evt.target.value}/>
                    <div className="input-group-btn">
                        <button className="btn btn-default" type="submit">
                            <i className="glyphicon glyphicon-search"></i>
                        </button>
                    </div>
                </div>
            </form>        
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
        if(this.selector) {
            return Selectors.getRows(this.state)[i];
        }
        return i>=0 ? this.dataFetcher.getRow(i) : null;
    }
    rowsCount() {
        if(this.selector) {
            let count = Selectors.getRows(this.state).length;
            return count
        }
        return this.dataFetcher.getRowCount();
    }

    render() {
        return  (
            <div>
                {this.createActionBar()}
                {this.props.ftSearch && this.createFTSearchBar()}
                <ReactDataGrid
                    rowGetter={this.rowGetter}
                    rowsCount={this.rowsCount()}
                    minHeight={500}
                    onRowClick={(idx,data) => {
                        this.handleRowClick(data)
                    }}
                    onRowExpandToggle={this.handleRowExpandToggle}
                    rowGroupRenderer={DefaultRowGroupRenderer}
                    onGridSort={this.handleGridSort}
                    {...this.props.grid}                
                />
            </div>
        );
    }    
}

export default CursorGrid
