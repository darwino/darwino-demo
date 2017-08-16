/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import PropTypes from 'prop-types';
import { Route, Link } from "react-router-dom";

export default class NavLink extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  render() {
    const { router } = this.context;
    const { to, children, exact, ...props } = this.props;

    return (
      <Route path={to} exact={exact} children={({match}) => (
        <li className={match ? 'active' : ''}>
          <Link to={to} {...props}>{children}</Link>
        </li>
      )}/>
    )
  }
}
