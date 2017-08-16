/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React, { Component } from "react";

/*
 * NavTitle
 */

export class NavGroup extends Component {

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
        const {title,collapsible} = this.props
        if(collapsible) {
            return (
                <li className="dropdown">
                    <a href="#" className="dropdown-toggle">
                        <i onClick={this.handleClick} className={"glyphicon "+(this.state.expanded ? "glyphicon-chevron-down" : "glyphicon-chevron-right")}></i>
                        &nbsp;
                        {title}
                    </a>
                    {this.state.expanded && this.props.children}
                </li>
            )
        } else {
            return (
                <li className="dropdown">
                    {this.props.children}
                </li>
            )               
        }
    }
}

export default NavGroup
