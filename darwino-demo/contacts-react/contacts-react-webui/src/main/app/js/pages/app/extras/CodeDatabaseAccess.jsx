/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React, {Component} from "react";
import { Button, ButtonToolbar, ControlLabel } from 'react-bootstrap';
import { Jsql, JstoreCursor } from '@darwino/darwino';

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

    render() {
        const {mainForm} = this.props;
        return (
            <div className="col-md-12 col-sm-12">
                <fieldset>
                    <div className="col-md-12 col-sm-12">
                        <br/>
                        <ControlLabel>Database columns (@DbColumn)</ControlLabel>
                        <p>
                            This example shows how to extract a list of values from the database. It either
                            uses the Darwino queries or JSQL.
                        </p>
                        <ButtonToolbar>
                            <Button bsStyle="primary" onClick={()=>this.dbcolumn()}>Use Darwino Query</Button>
                            <Button bsStyle="primary" onClick={()=>this.dbcolumnsql()}>Use JSQL</Button>
                        </ButtonToolbar>
                    </div>
                    <div className="col-md-12 col-sm-12">
                        <br/>
                        <ControlLabel>Value lookup (@DbLookup)</ControlLabel>
                        <p>
                            This example shows how to lookup a value using a key from the database. It either
                            uses the Darwino queries or JSQL.
                        </p>
                        <ButtonToolbar>
                            <Button bsStyle="primary" onClick={()=>this.dblookup(this.companyName)}>Use Darwino Query</Button>
                            <Button bsStyle="primary" onClick={()=>this.dblookupsql(this.companyName)}>Use JSQL</Button>
                        </ButtonToolbar>
                    </div>
                </fieldset>
            </div>
        );
    }
}

export default CodeDatabaseAccess