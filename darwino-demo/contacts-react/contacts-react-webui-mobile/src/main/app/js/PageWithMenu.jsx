/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React, {Component} from "react";
import PropTypes from 'prop-types';

import {
    Page,
    Splitter, SplitterSide, SplitterContent
} from 'react-onsenui';

import Menu from './Menu';

export default class PageWithMenu extends Component {

    // Context to read from the parent - navigator
    static contextTypes = {
        navigator: PropTypes.object
    };

    // We make the navigator globally available, similarly to react-navigator
    static childContextTypes = {
        layout: PropTypes.object
    };
    getChildContext() {
        return {layout: this};
    }
    

    constructor(props,context) {
        super(props,context);
        this.showLeftMenu = this.showLeftMenu.bind(this)
        this.state = {
            leftMenuOpen: false
        }
    }

    showLeftMenu(show) {
        if(this.state.leftMenuOpen!=show) {
            this.setState({leftMenuOpen: show});
        }
    }

    render() {
        const {...props} = this.props;
        return (
            <Page {...props}>
                <Splitter>
                    <SplitterSide
                        style={{
                            boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
                        }}
                        side='left'
                        width={300}
                        collapse={true}
                        // This does not initially render properly 
                        //collapse={"(max-width: 640px)"}
                        swipeable={true}
                        isOpen={this.state.leftMenuOpen}
                        onClose={() => this.showLeftMenu(false)}
                        onOpen={() => this.showLeftMenu(true)}>
                        <Menu navigator={this.context.navigator} layoutPage={this} showLeftMenu={this.showLeftMenu}/>
                    </SplitterSide>
                    <SplitterContent>
                        {this.props.children}
                    </SplitterContent>
                </Splitter>    
            </Page>    
        );
    }
}
