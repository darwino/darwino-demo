/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React, {Component} from "react";
import PropTypes from 'prop-types';

import {
    Page,
    PullHook,
    List,
    ListHeader,
    ListItem
} from 'react-onsenui';

import { CursorList } from '@darwino/darwino-react-onsenui';
import Constants from "./Constants";

import MaleImage from "../img/male.png";
import FemaleImage from "../img/female.png";

export default class AllCompanies extends CursorList {

    // Default values of the properties
    static defaultProps  = {
        databaseId: Constants.DATABASE,
        params: {
            name: "AllCompanies"
        }
    }

    constructor(props,context) {
        super(props,context);
        this.renderRow = this.renderRow.bind(this);
    }

    renderRow(row,index) {
        return (
            <ListItem key={index} onClick={() => 
                    this.context.navigator.pushPage({page:"company", props:{unid: row.__meta.unid}})
                }
            >
                <div className='center list__item__center'>
                    <div className='list__item__title'>
                        {row.Name}
                    </div>
                    <div className='list__item__subtitle'>
                        {row.Industry}
                    </div>                
                </div>
            </ListItem>    
        );
    }
    
    render() {
        return (
            <Page 
                onInfiniteScroll={() => {
                    this.loadMoreRows()
                }}
                onShow={() => {
                    this.reinitData()
                }}
            >
                <PullHook
                    onLoad={(done) => { this.reinitData(); done(); }}
                >
                    Pull to refresh...
                </PullHook>                
                <List
                    dataSource={this.dataFetcher.getRows(0,this.dataFetcher.getRowCount())}
                    renderRow={this.renderRow}
                >  
                    {this.dataFetcher.isError() && <ListItem>{this.dataFetcher.getErrorMessage()}</ListItem>}  
                </List>
            </Page>
        );
    }
}
