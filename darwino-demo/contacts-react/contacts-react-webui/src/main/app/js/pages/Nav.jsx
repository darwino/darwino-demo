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

import React from "react";

import NavLink from "../darwino-react-bootstrap/components/NavLink.jsx";

export default class Nav extends React.Component {
    render() {
        const { location } = this.props;
    
        return (
            <nav className="navbar navbar-default navbar-fixed-side" role="navigation">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" data-target="#dwo-nav-collapse" data-toggle="collapse" className="navbar-toggle">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        </button>
                    </div>
                    <div className="navbar-collapse collapse" id="dwo-nav-collapse">
                        <ul className="nav navbar-nav">
                            <NavLink to="/">Home</NavLink>

                            <li className="dropdown">
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown">Contacts</a>
                                <ul className="dropdown-menu">
                                    <NavLink to="/app/allcontacts">All Contacts</NavLink>
                                    <NavLink to="/app/byauthor">By Author</NavLink>
                                    <NavLink to="/app/bystate">By State</NavLink>
                                    <NavLink to="/app/bydate">By Date</NavLink>
                                </ul>
                            </li>

                            <li className="dropdown">
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown">Companies</a>
                                <ul className="dropdown-menu">
                                    <NavLink to="/app/allcompanies">All Companies</NavLink>
                                    <NavLink to="/app/allcompaniesbyindustry">By Industry/State</NavLink>
                                </ul>
                            </li>

                            <li className="dropdown">
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown">Initials</a>
                                <ul className="dropdown-menu">
                                    <NavLink to="/app/contacts">Contacts</NavLink>
                                    <NavLink to="/app/contactsg">Contacts Grid</NavLink>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}