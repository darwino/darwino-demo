/**
 * Dynamic Tab Component
 * 
 * Inspired, but largely modified, from (license MIT)
 *     https://github.com/freeranger/react-bootstrap-tabs
 * or
 *     https://github.com/darwino/react-bootstrap-tabs
 */

import React    from 'react';
import classes  from 'classnames';
import PropTypes from 'prop-types';
import './DynamicTabs.css';


class DynamicTabs extends React.Component {

    static propTypes = {
        /**
         * The selected tab - either the index of it or the label string.  Defaults to tab 0 if not supplied
         */
        selected: PropTypes.oneOfType([PropTypes.string]),

        /**
         * Optional CSS class to apply to the Tabs component overall
         */
        className: PropTypes.string,

        /**
         * Optional CSS style to apply to the Tabs component overall
         */
        style: PropTypes.object,

        /**
         * Optional method to call when a tab is selected.  Receive the tab index and tab of the selected tab
         */
        onSelect: PropTypes.func,

        /**
         * Optional method to call when a tab is selected.  Receive the tab index and tab of the closed tab
         */
        onClose: PropTypes.func,
    }

    static defaultProps = {
        selected: ""
    }

    render() {
      const classNames = classes('tabs', this.props.className);

      return (
          <div className={classNames} style={this.props.style}>
              {this._renderHeaders()}
              {this._renderContent()}
          </div>
      );
    }

    _renderHeaders() {
        return (
            <ul role="tablist" className="nav nav-tabs">
              {
                this.props.tabs.map( (tab,index) => {
                  return this._renderHeader(tab,index);
                })
              }
            </ul>
        );
    }

    _renderHeader = (tab, index) => {
        const isActive = this.props.selected === tab.id;
        const disabled = tab.disabled;
        const closeable = tab.closeable;

        const liClass = disabled ? "disabled" : (!isActive ? "nav-item" : "nav-item active")

        return (
            <li role="presentation" key={tab.id} className={liClass}>
                <a href='#' onClick={disabled ? null : this._handleSelect.bind(this, index)}>
                  {closeable && !disabled && <button className="close" type="button" onClick={this._handleClose.bind(this, index)}>×</button>}
                  {tab.label}
                </a>
            </li>
        );
    };

    // Keep all the tabs open and simply hide/show them
    // Might be a parameter going forward
    _renderContent() {
      return this.props.tabs.map( (tab) => {
        const visible = tab.id===this.props.selected ;
        return (
          <div key={tab.id} className='tab-content' style={{display: visible ? 'block':'none'}}>
            {tab.component}
          </div>)
        }
      );
    }
  //   _renderContent() {
  //     const tab = this.props.tabs.find( tab => tab.id===this.props.selected );
  //     if(tab) {
  //       return (
  //           <div className='tab-content'>
  //             {tab.component}
  //           </div>
  //       );
  //     }
  // }

    _handleSelect(index, event) {
      event.preventDefault();
      event.stopPropagation();
      const selected = this.props.tabs[index].id;
      if(selected!==this.props.selected) {
        if (this.props.onSelect !== undefined) {
          this.props.onSelect(this.props.tabs[index],index);
        }
      }
    }

    _handleClose(index, event) {
      event.preventDefault();
      event.stopPropagation();
      if(this.props.onClose !== undefined) {
          this.props.onClose(this.props.tabs[index],index);
      }
    }
};

export default DynamicTabs;
