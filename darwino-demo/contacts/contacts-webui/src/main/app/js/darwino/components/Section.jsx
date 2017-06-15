/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc. 2014-2017.
 *
 * Notice: The information contained in the source code for these files is the property 
 * of Darwino Inc. which, with its licensors, if any, owns all the intellectual property 
 * rights, including all copyright rights thereto.  Such information may only be used 
 * for debugging, troubleshooting and informational purposes.  All other uses of this information, 
 * including any production or commercial uses, are prohibited. 
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
