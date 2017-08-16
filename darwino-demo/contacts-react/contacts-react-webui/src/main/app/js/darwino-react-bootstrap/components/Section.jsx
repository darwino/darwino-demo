/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React, { Component } from "react";
import { FormGroup, Panel, ControlLabel } from "react-bootstrap";

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
