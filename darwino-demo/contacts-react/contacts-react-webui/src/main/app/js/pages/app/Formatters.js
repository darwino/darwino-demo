/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import { FormattedDate, FormattedTime } from "react-intl";

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
    if(sex=='M') {
        return (
            <div><img alt="male" src={MaleImage} style={{height: 20, marginRight: 10}}/>Male</div>
        )
    } else {
        return (
            <div><img alt="female" src={FemaleImage}  style={{height: 20, marginRight: 10}}/>Female</div>
        )
    }
}

export const SizeFormatter = function(props) {
    const size = props.value;
    if(size=='0') return <span>0-9</span>
    if(size=='1') return <span>10-499</span>
    if(size=='2') return <span>500-9,999</span>
    return <span>10,000+</span>
}
