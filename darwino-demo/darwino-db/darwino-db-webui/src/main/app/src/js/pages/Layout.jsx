/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2018.
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

/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React from "react";
import PropTypes from 'prop-types';

import { Dialog } from '@darwino/darwino-react-bootstrap';

import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

import Home from "./Home.jsx";
import TabDatabase from "./TabDatabase.jsx";
import TabDocument from "./TabDocument.jsx";
import TabCommands from "./TabCommands.jsx";
import TabScripts from "./TabScripts.jsx";
import TabSql from "./TabSql.jsx";
import TabJsql from "./TabJsql.jsx";
import TabTasks from "./TabTasks.jsx";
import TabConnections from "./TabConnections.jsx";
import DynamicTabs from '../components/DynamicTabs'
import TreeView, {MicroserviceTree} from '../components/TreeView'
import globalState from './GlobalState'
import TabDarwinoBeans from "./TabDarwinoBeans.jsx";
import TabDarwinoProperties from "./TabDarwinoProperties.jsx";

import { notificationCenter } from './NotificationCenter';


let nextTabId = 1;

export default class Layout extends React.Component {

  // Context to pusblish to the children - documentForm
  static childContextTypes = {
    tabManager: PropTypes.object
  };
  getChildContext() {
    return {tabManager: this};
  }

  constructor(props) {
    super(props)

    // Header
    this.handleToggle = this.handleToggle.bind(this)

    // Navigator Tree
    this.tree = new MicroserviceTree();
    this.onTreeClick = this.onTreeClick.bind(this)

    // Dynamic tabs
    this.onSelectTab = this.onSelectTab.bind(this)
    this.onCloseTab = this.onCloseTab.bind(this)

    this.state = {
      sideNavExpanded: false,
      treeData: undefined,
      tabs: [],
      selectedTab: ""
    }
  }

  onTreeClick(node) {
    this.openTab(node._type,node.id)
  }

  openTab(type,id) {
    const tabs = this.state.tabs;
    const tabId = type+':'+id;
    // Select an existing tab if it already exists
    const tab = tabs.find( (t) => {
      return t.id === tabId;
    });
    if(tab) {
      this.setState({
        selectedTab: tab.id
      });
      return;
    }
    // Nope, open a new one
    let newTab;
    if(type==="database") {
      const databaseId = id;
      newTab = {
        _type: "database",
        id: tabId,
        label: id,
        component: React.createElement(TabDatabase,{databaseId}),
        closeable: true
      }        
    }
    if(type==="store") {
      const [databaseId,storeId] = id.split(':')
      newTab = {
        _type: "store",
        id: tabId,
        label: `${databaseId}:${storeId}`,
        component: React.createElement(TabDatabase,{databaseId,storeId}),
        closeable: true
      }        
    }
    if(type==="document") {
      const [databaseId,storeId,unid] = id.split(':')
      newTab = {
        _type: "document",
        id: tabId,
        label: `${unid}`,
        component: React.createElement(TabDocument,{databaseId,storeId,unid}),
        closeable: true
      }        
    }
    if(type==="tasks") {
      newTab = {
        _type: "tasks",
        id: tabId,
        label: "Tasks",
        component: React.createElement(TabTasks),
        closeable: true
      }        
    }
    if(type==="connections") {
      newTab = {
        _type: "connections",
        id: tabId,
        label: "Connections",
        component: React.createElement(TabConnections),
        closeable: true
      }        
    }
    if(type==="commands") {
      newTab = {
        _type: "commands",
        id: tabId,
        label: "Commands",
        component: React.createElement(TabCommands),
        closeable: true
      }        
    }
    if(type==="scripts") {
      newTab = {
        _type: "scripts",
        id: tabId,
        label: "Scripts",
        component: React.createElement(TabScripts),
        closeable: true
      }        
    }
    if(type==="sql") {
      newTab = {
        _type: "sql",
        id: tabId,
        label: "Sql",
        component: React.createElement(TabSql),
        closeable: true
      }        
    }
    if(type==="jsql") {
      newTab = {
        _type: "jsql",
        id: tabId,
        label: "Jsql",
        component: React.createElement(TabJsql),
        closeable: true
      }        
    }
    if(type==="beans") {
      newTab = {
        _type: "beans",
        id: tabId,
        label: "Darwino Beans",
        component: React.createElement(TabDarwinoBeans),
        closeable: true
      }        
    }
    if(type==="properties") {
      newTab = {
        _type: "properties",
        id: tabId,
        label: "Darwino Properties",
        component: React.createElement(TabDarwinoProperties),
        closeable: true
      }        
    }
    this.newTab(newTab,tabId)
  }

  newDocument(databaseId,storeId) {
    const tabId = [databaseId,storeId,nextTabId++].join(':'); 
    const newTab = {
      _type: "store",
      id: tabId,
      label: 'New Document',
      component: React.createElement(TabDocument,{databaseId,storeId,undefined}),
      closeable: true
    }        
    this.newTab(newTab,tabId)
  }

  newTab(newTab,tabId) {
    const tabs = this.state.tabs;
    if(newTab) {
      tabs.push(newTab);
      this.setState({
        tabs,
        selectedTab: tabId
      });
    }
  }


  componentDidMount() {
    globalState.treeView().then( (r) => {
      this.setState({treeData: r});
    })
    this.socketListener = {
      "onCommand": (command,msg) => { 
          if(command==="metachanged") {
            console.log('metadata changed!');
            globalState.treeView(true).then( (r) => {
              this.setState({treeData: r});
            })
          }
      }
    } 
    notificationCenter.addListener(this.socketListener);
  }
  
  componentWillUnmount() {
    notificationCenter.removeListener(this.socketListener);
    this.socketListener = null;
  }

  onSelectTab(tab,index) {
    this.setState({selectedTab: tab.id})
  }

  onCloseTab(tab,index) {
    const tabs = this.state.tabs;
    tabs.splice(index,1);
    const selectedTab = tabs.length>0 ? tabs[Math.min(index,tabs.length-1)].id : "";
    this.setState({tabs,selectedTab})
  }

  handleToggle() {
    this.setState({sideNavExpanded: !this.state.sideNavExpanded})
  }

  render() {
    return (
      <div>
        <Header onToggleNavigator={this.handleToggle} mainPage={this}/>
        <Dialog/>
        <div className="container-fluid" id="body-container">
          <div className="row">
            <div className="col-sm-3 col-lg-2 sidebar">
              { this.state.treeData 
                  ? (<TreeView data={this.state.treeData} tree={this.tree} onClick={this.onTreeClick}/>)
                  : (<div>Loading...</div>)
              }
            </div>
            <div className="col-sm-9 col-lg-10 main" id="content">
              {this.state.tabs.length>0 
                ? (<DynamicTabs tabs={this.state.tabs} selected={this.state.selectedTab} onSelect={this.onSelectTab} onClose={this.onCloseTab}/>)
                : (<Home/>)
              }
            </div>
          </div>
        </div>
        <div className="hidden-xs">
          <Footer/>
        </div>
      </div>
    );
  }
}
