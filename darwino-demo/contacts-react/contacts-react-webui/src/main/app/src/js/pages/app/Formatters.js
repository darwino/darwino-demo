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
import React from "react";
import {  _t } from '@darwino/darwino';
import { FormattedDate, FormattedTime } from "react-intl";
import Constants from "./Constants";

import MaleImage from "../../../img/male.png";
import FemaleImage from "../../../img/female.png";

/*
 * Formmaters for the grid columns
 */
export const DateFormatter = function(props) {
    const date = props.value;
    return (
        <div>
            <FormattedDate value={date}/>, <FormattedTime value={date}/>
        </div>
    )
}

export const SexFormatter = function(props) {
    const sex = props.value;
    if(sex==='M') {
        return (
            <div><img alt={_t("formatters.male","Male")} src={MaleImage} style={{height: 20, marginRight: 10}}/>{_t("formatters.male","Male")}</div>
        )
    } else
    if(sex==='F') {
        return (
            <div><img alt={_t("formatters.female","Female")} src={FemaleImage}  style={{height: 20, marginRight: 10}}/>{_t("formatters.female","Female")}</div>
        )
    } else {
        return (
            <b>{sex}</b>
        )
    }
}

export const StateFormatter = function(props) {
    const state = props.value;
    const US_STATES = Constants.US_STATES;
    for(let i=0; i<US_STATES.length; i++) {
        if(US_STATES[i].value===state) {
            return US_STATES[i].label;
        }
    }
    return state;
}

export const SizeFormatter = function(props) {
    const size = props.value;
    if(size==='0') return <span>0-9</span>
    if(size==='1') return <span>10-499</span>
    if(size==='2') return <span>500-9,999</span>
    return <span>10,000+</span>
}
