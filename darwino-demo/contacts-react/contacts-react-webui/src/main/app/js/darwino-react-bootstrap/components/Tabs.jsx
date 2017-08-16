/* 
 * (c) Copyright Darwino Inc. 2014-2017.
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

    // static propTypes = {
    //     selected: React.PropTypes.number,
    //     children: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.element])
    // }

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
