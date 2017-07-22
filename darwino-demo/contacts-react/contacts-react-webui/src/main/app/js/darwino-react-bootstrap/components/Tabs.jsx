/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2017.
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

import React, { Component } from "react";

/*
 * Minimal Bootstrap Tabs
 * 
 * <Tabs selected=0>
 *     <Tab label="Tab1">
 *         <div>content</div>
 *     </Tab>
 *     <Tab label="Tab2">
 *         <div>content</div>
 *     </Tab>
 * </Tabs>
 */
class Tabs extends React.Component {

    static propTypes = {
        selected: React.PropTypes.number,
        children: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.element])
    }

    static defaultProps = {
        selected: 0
    }

    constructor(props) {
        super(props);

        this.state = {
            selected: this.props.selected
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ selected: nextProps.selected });
    }

    render() {
        if (this.props.children) {
            return (
                <div>
                    {this._renderTabBar()}
                    {this._renderActiveContent()}
                </div>
            );
        }
    }

    asArray(v) {
        return Array.isArray(v) ? v : [v];
    }

    _renderTabBar() {
        const children = this.asArray(this.props.children);
        return (
            <ul role="tablist" className="nav nav-tabs">
                {children.map(this._renderTab.bind(this))}
            </ul>
        );
    }

    _renderTab = (tab, index) => {
        const liClass = (this.state.selected===index) ? 'active' : null;
        const aClass = 'nav-link'+(tab.props.disabled ? ' disabled' : '');
        const onClick = tab.props.disabled ? null : this._handleClick.bind(this, index);
        return (
            <li key={index} className={liClass} >
                <a className={aClass} onClick={onClick}>{tab.props.label}</a>
            </li>
        );
    };

    _renderActiveContent() {
        const children = this.asArray(this.props.children);
        let selected = Math.min(this.state.selected,children.length);
        return selected>=0 ? children[selected] : null;
    }

    _handleClick(index, event) {
        event.preventDefault();
        this.setState({selected: index});
        if (this.props.onSelect) {
            const children = this.asArray(this.props.children);
            this.props.onSelect(index, children[index].props.label);
        }
    }
};

/**
 * <Tab label="Tab Label">
 *     <div>content</div>
 * </Tab>
 */
class Tab extends React.Component {

    static propTypes = {
        label: React.PropTypes.string.isRequired,
        disabled: React.PropTypes.bool,
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (<div>{this.props.children}</div>);
    }
};

export {Tabs, Tab};
