import React from "react";

import NavItem from "./NavItem.jsx";

export default class Nav extends React.Component {
  constructor() {
    super()
    this.state = {
      collapsed: true,
    };
  }

  toggleCollapse() {
    const collapsed = !this.state.collapsed;
    this.setState({collapsed});
  }

  render() {
    const { location } = this.props;
    const { collapsed } = this.state;
    // const featuredClass = location.pathname === "/" ? "active" : "";
    // const archivesClass = location.pathname.match(/^\/archives/) ? "active" : "";
    // const settingsClass = location.pathname.match(/^\/settings/) ? "active" : "";
    const navClass = collapsed ? "collapse" : "";
    
    /*
     * 
              <li activeClassName="active">
                <Link to="archives" onClick={this.toggleCollapse.bind(this)}>Archives</Link>
              </li>
              <li activeClassName="active">
                <Link to="settings" onClick={this.toggleCollapse.bind(this)}>Settings</Link>
              </li>
     */

    return (
      <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div class="container">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle" onClick={this.toggleCollapse.bind(this)} >
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
          </div>
          <div class={"navbar-collapse " + navClass} id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav">
              <NavItem to="/" index={true} onlyActiveOnIndex={true} onClick={this.toggleCollapse.bind(this)}>Breweries</NavItem>
              <NavItem to="/beers" onClick={this.toggleCollapse.bind(this)}>Beers</NavItem>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}