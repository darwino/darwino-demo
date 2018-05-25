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

export default class AllContacts extends CursorList {

    // Default values of the properties
    static defaultProps  = {
        databaseId: Constants.DATABASE,
        params: {
            name: "AllContacts"
        }
    }

    constructor(props,context) {
        super(props,context);
        this.renderRow = this.renderRow.bind(this);
    }

    renderSex(row) {
        const sex = row.Sex;
        if(sex=='M') {
            return (
                <img alt="male" src={MaleImage} style={{height: 40, marginRight: 10}}/>
            )
        } else
        if(sex=='F') {
            return (
                <img alt="female" src={FemaleImage}  style={{height: 40, marginRight: 10}}/>
            )
        } else {
            return (
                <b>{sex}</b>
            )
        }
    }

    renderRow(row,index) {
        return (
            <ListItem key={index} onClick={() => 
                    this.context.navigator.pushPage({page:"contact", props:{unid: row.__meta.unid}})
                }
            >
                <div className='left'>
                    {this.renderSex(row)}
                </div>
                <div className='center list__item__center'>
                    <div className='list__item__title'>
                        {row.CommonName}
                    </div>
                    <div className='list__item__subtitle'>
                        {row.EMail}
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
