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
import { FormGroup, Panel, ControlLabel } from "react-bootstrap";

const DEFAULT_PAGE_SIZE = 50;

/*
 * Collapsible Section
 */

export class Section extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            expanded: props.defaultExpanded
        };    
    }

    handleClick() {
        this.setState({ expanded: !this.state.expanded })
    }

    render() {
        const { title, className } = this.props;
        return (
                <FormGroup className={className}>
                    <ControlLabel onClick={this.handleClick}>
                        <i className={"glyphicon "+(this.state.expanded ? "glyphicon-chevron-down" : "glyphicon-chevron-right")}></i>
                        {title}
                    </ControlLabel>
                    <Panel collapsible expanded={this.state.expanded}>
                        {this.props.children}
                    </Panel>
                </FormGroup>
            )               
    }
}

export default Section
