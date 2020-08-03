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

import React, { Component } from "react";
import { Jumbotron } from "react-bootstrap";

export default class Home extends Component {

    //
    // This page shows how to route to a locale specifiv version of the page
    //
    render() {
        return (
            <div>
                <Jumbotron>
                <h1>Darwino Database</h1>
                <p>
                    Welcome to Darwino Database, the RDBMS powered database.
                    Darwino DB. Your data. Secure. Everywhere. All the time.
                </p>
                <p>
                    This application allows you to maintain your Darwino Databases from a web application,
                    whenever your databases are running on the cloud or on premises.
                </p>
                <p>
                    If you are a Domino user, then it allows you to replicate existing Domino databases
                    within a Darwino database.
                </p>
                </Jumbotron>
                <br/>
                <br/>
                This application spawns a web application server and exposes a series of REST services. All the APIs are documented here: 
                <a href="http://playground.darwino.com/playground.nsf/OpenApiExplorer.xsp#openApi=Json_Store/">Darwino REST APIs documentation</a>. <br/>
                Also, both the database and document screens provide a REST tab with some service call examples.
            </div>
        );
    }
}