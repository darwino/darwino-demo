/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc. 2014-2017.
 *
 * Notice: The information contained in the source code for these files is the property 
 * of Darwino Inc. which, with its licensors, if any, owns all the intellectual property 
 * rights, including all copyright rights thereto.  Such information may only be used 
 * for debugging, troubleshooting and informational purposes.  All other uses of this information, 
 * including any production or commercial uses, are prohibited. 
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
    const { to, children, ...props } = this.props;

    return (
      <Route path={to} children={({match}) => (
        <li className={match ? 'active' : ''}>
          <Link to={to} {...props}>{children}</Link>
        </li>
      )}/>
    )
  }
}
