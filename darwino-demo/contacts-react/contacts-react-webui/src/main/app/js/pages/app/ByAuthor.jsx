/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import { CursorPage, CursorGrid} from '@darwino/darwino-react-bootstrap'

import Constants from "./Constants";
import {SexFormatter} from "./Formatters";

const ByAuthorGrid = (props) => {
    return (
        <CursorGrid
            height={props.height}
            databaseId={Constants.DATABASE}
            params={{
                name: "ByAuthor"
            }}
            grid={{
                columns:[
                    {name: "Author", key: "$Creator", resizable:true, width: 1},
                    {name: "Name", key: "CommonName", resizable:true },
                    {name: "EMail", key: "EMail", resizable:true},
                    {name: "Sex", key: "Sex", resizable:true, formatter: SexFormatter, width:100},
                    {name: "State", key: "State", resizable:true, width:70}
                ]
            }}
            expandLevel={1}
            groupBy={[{column: "$Creator"}]}
            baseRoute="/app/contact"
        />
    )
}

export default class ByAuthor extends CursorPage {
    
    constructor(props,context) {
        super(props,context)
    }
    
    render() {
        return (
            <div>
                <h4>By Author</h4>
                {this.createActionBar()}
                <div>
                    <ByAuthorGrid ref="grid" 
                        height={this.state.gridHeight}/>
                </div>
            </div>
        )
    }
}
