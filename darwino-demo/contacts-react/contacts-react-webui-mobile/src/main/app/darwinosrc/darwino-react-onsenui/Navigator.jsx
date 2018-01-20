/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    Navigator as OnsNavigator
} from 'react-onsenui';

/**
 * Navigator class that pushes itself to the child context
 */
export default class Navigator extends OnsNavigator {

    // We make the navigator globally available, similarly to react-navigator
    static childContextTypes = {
        navigator: PropTypes.object
    };
    getChildContext() {
        return {navigator: this};
    }
    
    constructor(props) {
        super(props);
    }
}
