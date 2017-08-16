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
                    <a className="dropdown-toggle" onClick={this.handleClick}>
                        <i className={"glyphicon "+(this.state.expanded ? "glyphicon-chevron-down" : "glyphicon-chevron-right")}></i>
                        &nbsp;
                        {title}
                    </a>
                    {this.state.expanded && (
                        <ul className="dropdown-menu">
                            {this.props.children}
                        </ul>
                    )}
                </li>
            )
        } else {
            return (
                <li className="dropdown">
                    <ul className="dropdown-menu">
                        {this.props.children}
                    </ul>
                </li>
            )               
        }
    }
}

export default NavGroup
