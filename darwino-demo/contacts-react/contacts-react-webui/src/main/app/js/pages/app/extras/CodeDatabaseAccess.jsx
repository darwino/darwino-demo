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
import { Button, ButtonToolbar, ControlLabel } from 'react-bootstrap';
import { Jsql, JstoreCursor } from '@darwino/darwino';
import {  _t } from '@darwino/darwino';

import Constants from "../Constants.jsx";

class CodeDatabaseAccess extends Component {
    
    companyName = ""
    
    constructor(props,context) {
        super(props,context)

        // get a company name for further resuse
        new JstoreCursor()
            .database(Constants.DATABASE)
            .store("_default")
            .queryParams({name:"AllCompanies"})
            .extract({Name:'name'})   
            .limit(1)
            .fetch()
            .then((json) => {
                    this.companyName = json[0].Name
                })
    }
    
    //
    // DB Columns
    //
    dbcolumn() {
        new JstoreCursor()
            .database(Constants.DATABASE)
            .store("_default")
            .queryParams({name:"AllCompanies"})
            // This is an optimization to not retrieve all the view columns
            .extract({Name:'name'})   
            .fetch()
            .then((json) => {
                    return json.map((v)=>v["Name"])
                })
            .then((json) => {
                    alert(JSON.stringify(json))
                })
    }

    dbcolumnsql() {
        new Jsql()
            .database(Constants.DATABASE)
            .query("SELECT $.name name FROM companies WHERE $.form='Company' ORDER BY name")
            .format('value')
            .fetch()
            .then((json) => {
                alert(JSON.stringify(json))
            });
    }

    //
    // DB Lookup
    //
    dblookup(key) {
        new JstoreCursor()
            .database(Constants.DATABASE)
            .store("_default")
            .queryParams({name:"AllCompanies"})
            // Extract the desired field
            .extract({Name:'name'})   
            .key(key)
            .fetch()
            .then((json) => {
                    return json.map((v)=>v["Name"])
                })
            .then((json) => {
                    alert("Key="+key+"\n"+JSON.stringify(json))
                })
    }

    dblookupsql(key) {
        new Jsql()
            .database(Constants.DATABASE)
            .query("SELECT $.name name FROM companies WHERE $.form='Company' AND $.name=:key ORDER BY name")
            .params({key})
            .format('value')
            .fetch()
            .then((json) => {
                    alert("Key="+key+"\n"+JSON.stringify(json))
                });
    }


    //
    // DB perfoamnce
    //
    dbPerformance(count,categorized) {
        const js = new JstoreCursor()
            .database(Constants.DATABASE)
            .store("_default")
            .queryParams({name:"ByState"})
            .limit(count)
        if(categorized) {
            js.categoryCount(1);
        }
        const start = performance.now()
        js.fetch().then((json) => {
            const end = performance.now()
            alert(JSON.stringify("Read "+json.length+" entries, "+(end-start).toFixed(0)+"ms"))
        })
    }

    render() {
        const {mainForm} = this.props;
        return (
            <div className="col-md-12 col-sm-12">
                <fieldset>
                    <div className="col-md-12 col-sm-12">
                        <br/>
                        <ControlLabel>{_t("codedba.descdbcol","Database columns (@DbColumn)")}</ControlLabel>
                        <p>
                            {_t("codedba.descextr","This example shows how to extract a list of values from the database. It either uses the Darwino queries or JSQL.")}
                        </p>
                        <ButtonToolbar>
                            <Button bsStyle="primary" onClick={()=>this.dbcolumn()}>{_t("codedba.dwoquery","Use Darwino Query")}</Button>
                            <Button bsStyle="primary" onClick={()=>this.dbcolumnsql()}>{_t("codedba.jsql","Use JSQL")}</Button>
                        </ButtonToolbar>
                    </div>
                    <div className="col-md-12 col-sm-12">
                        <br/>
                        <ControlLabel>{_t("codedba.dblookup","Value lookup (@DbLookup)")}</ControlLabel>
                        <p>
                            {_t("codedba.desclk","This example shows how to lookup a value using a key from the database. It either uses the Darwino queries or JSQL.")}
                        </p>
                        <ButtonToolbar>
                            <Button bsStyle="primary" onClick={()=>this.dblookup(this.companyName)}>{_t("codedba.dwoquery","Use Darwino Query")}</Button>
                            <Button bsStyle="primary" onClick={()=>this.dblookupsql(this.companyName)}>{_t("codedba.jsql","Use JSQL")}</Button>
                        </ButtonToolbar>
                    </div>

                    <div className="col-md-12 col-sm-12">
                        <br/>
                        <ControlLabel>{_t("codedba.perftest","Performance Tests")}</ControlLabel>
                        <p>
                            {_t("codedba.decperf","This is used internally to measure performance")}
                        </p>
                        <ButtonToolbar>
                            <Button bsStyle="primary" onClick={()=>this.dbPerformance(1000)}>{_t("codedba.1000","1000 view entries")}</Button>
                            <Button bsStyle="primary" onClick={()=>this.dbPerformance(10000)}>{_t("codedba.10000","10,000 view entries")}</Button>
                            <Button bsStyle="primary" onClick={()=>this.dbPerformance(50000)}>{_t("codedba.50000","50,000 view entries")}</Button>
                            <Button bsStyle="primary" onClick={()=>this.dbPerformance(50000,true)}>{_t("codedba.50000cat","50,000 view entries, categorized")}</Button>
                        </ButtonToolbar>
                    </div>
                </fieldset>
            </div>
        );
    }
}

export default CodeDatabaseAccess