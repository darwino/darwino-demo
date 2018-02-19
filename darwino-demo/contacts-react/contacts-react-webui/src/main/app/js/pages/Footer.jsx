/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React from "react";
import {  _t } from '@darwino/darwino';


export default class Footer extends React.Component {
  render() {
    return (
      <footer id="footer" className={"navbar navbar-default navbar-fixed-bottom footer"+(this.props.inverse ? " navbar-inverse " : " ")+(this.props.className||"")}>
        <p className="navbar-text">{_t("footer.copyright","(c) 2017 Darwino.com.")}</p>
      </footer>
    );
  }
}