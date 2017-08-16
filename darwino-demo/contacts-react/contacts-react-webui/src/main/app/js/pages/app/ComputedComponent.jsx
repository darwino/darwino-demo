/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

 //
 // Example of calculated components
 // 

import React, { Component } from "react";
import CCAddress from "./CCAddress.jsx";

export default class ComputedComponent extends Component {

    render() {
        const { name } = this.props;
        switch(name) {
            case "CCAddress": return <CCAddress {...this.props}/>
        }
    }
}
