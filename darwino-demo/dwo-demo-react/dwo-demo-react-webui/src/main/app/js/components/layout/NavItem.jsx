import React from "react";
import { IndexLink, Link } from "react-router";

export default class NavItem extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  render() {
    const { router } = this.context;
    const { index, onlyActiveOnIndex, to, children, ...props } = this.props;

    const isActive = router.isActive(to, onlyActiveOnIndex);
    const LinkComponent = index ? Link : IndexLink;

    return (
      <li className={isActive ? 'active' : ''}>
        <LinkComponent to={to} {...props}>{children}</LinkComponent>
      </li>
    )
  }
}