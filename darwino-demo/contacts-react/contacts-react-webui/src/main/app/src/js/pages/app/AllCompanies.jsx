/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2020.
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
import React from "react";
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';

import { MicroServices } from '@darwino/darwino';
import {  _t } from '@darwino/darwino';
import { CursorPage, CursorGrid, Messages} from '@darwino/darwino-react-bootstrap'

import Constants from "./Constants";
import {checkUser} from "./Demo";
import {SizeFormatter} from "./Formatters";

class AllCompanies extends CursorPage {

    constructor(props,context) {
        super(props,context)
        this.displaySelection = this.displaySelection.bind(this)
        this.handleDeleteSelectedDocuments = this.handleDeleteSelectedDocuments.bind(this)
    }

    displaySelection() {
        if(this.getGrid()) {
            let sel = ""
            this.getGrid().getSelectedEntries().forEach( e => {
                sel += "\n" + e.Name
            });
            alert(_t("allcomp.selection","Selection: ")+sel)
        }
    }

    setSize(size) {
        if(this.getGrid()) {
            let sel = this.getGrid().getSelectedEntries().map( e => e.__meta.unid );
            new MicroServices()
                .name("SetCompanySize")
                .params({ids: sel, size})
                .fetch()
                .then((r) => {
                    this.getMessages().add({key:"setsize",title:_t("allcomp.updsuccess","Update Success"),message:r.message,type: Messages.SUCCESS})
                    this.getGrid().reinitData()
                })
                .catch((e) => {
                    this.getMessages().add({key:"setsize",title:_t("allcomp.upderror","Update Error"),message:e.message,type: Messages.ERROR})
                })
        }
    }

    handleDeleteSelectedDocuments() {
        if(!checkUser(this)) {
            return;
        }
        if(this.getGrid()) {
            this.getGrid().handleDeleteSelectedDocuments();
        }
    }

    contributeActionBar() {
        return (
            <div key="main">
                <Button bsStyle="primary" onClick={this.displaySelection}>{_t("allcomp.dispsel","Display Selection...")}</Button>
                <DropdownButton key="address" title={_t("allcomp.setsize","Set Size")} id="dropdown-size-medium">
                    <MenuItem eventKey="1" onClick={()=>(this.setSize(0))}>0-9</MenuItem>
                    <MenuItem eventKey="2" onClick={()=>(this.setSize(1))}>10-499</MenuItem>
                    <MenuItem eventKey="3" onClick={()=>(this.setSize(2))}>500-9999</MenuItem>
                    <MenuItem eventKey="3" onClick={()=>(this.setSize(3))}>10,000+</MenuItem>
                </DropdownButton>
                <div className="pull-right">
                    <Button onClick={this.handleDeleteSelectedDocuments} bsStyle="danger">{_t("allcomp.delete","Delete")}</Button>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                <h4>{_t("allcomp.allcomp","All Companies")}</h4>
                {this.createActionBar()}
                {this.createMessages()}
                <CursorGrid ref="grid" 
                    height={this.state.gridHeight}
                    databaseId={Constants.DATABASE}
                    params={{
                        name: "AllCompanies"
                    }}
                    selectRows={true}
                    responsive={true}
                    columns={[
                        {name: _t("allcomp.name","Name"), key: "Name", resizable:true, sortable: true, sortField: 'name'},
                        {name: _t("allcomp.industry","Industry"), key: "Industry", resizable:true, sortable: true, sortField: 'industry'},
                        {name: _t("allcomp.size","Size"), key: "Size", formatter:SizeFormatter,resizable:true, sortable: true, sortField: 'size', width:100},
                        {name: _t("allcomp.state","State"), key: "State", resizable:true, sortable: true, sortField: 'state', width:90, hideWhenStacked: true}
                    ]}
                    baseRoute="/app/company"
                />
            </div>
        )
    }
}

export default AllCompanies