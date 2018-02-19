/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React, { Component } from "react";
import {  I18N } from '@darwino/darwino';
import Home_en from './Home_en';
import Home_fr from './Home_fr';

export default class Home extends Component {

    //
    // This page shows how to route to a locale specifiv version of the page
    //
    render() {
        if(I18N.getLocale()=="fr") {
            return <Home_fr/>;
        }
        return <Home_en/>;
    }
}