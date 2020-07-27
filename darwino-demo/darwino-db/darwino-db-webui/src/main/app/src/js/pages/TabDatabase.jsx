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
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import globalState from './GlobalState';
import {Tab,Button,ButtonToolbar} from 'react-bootstrap';
import {Section} from '@darwino/darwino-react-bootstrap';
import MaterialDesignTabs from '../components/MaterialDesignTabs';
import CodeEditor from '../components/CodeEditor';
import CursorCount from '../components/CursorCount';
import SearchQuery from '../components/SearchQuery';
import {stringifySorted} from '../utils/jsonutils'

import { CursorPage, CursorGrid } from '@darwino/darwino-react-bootstrap'

import { StoreIdFormatter, UnidFormatter, JsonFormatter } from '../utils/Formatters'


export default class TabDatabase extends CursorPage {

  // Context to read from the parent - router
  static contextTypes = {
    tabManager: PropTypes.object
  };
  
  constructor(props,context) {
    super(props,context);
    this.state = { 
      database: undefined, 
      error: undefined,
      params: {
        unid: "",
        query: "",
        ftEnabled: false,
        ftsearch: ""
      }
    };
    this.onSearch = this.onSearch.bind(this);
    this.onRowDblClick = this.onRowDblClick.bind(this);
    this.onNewDocument = this.onNewDocument.bind(this);
    this.onDeleteDocuments = this.onDeleteDocuments.bind(this)
    this.reinitData = this.reinitData.bind(this);

    this.loadDatabase();
  }

  componentDidUpdate(prevProps) {
    if(this.props.databaseId!==prevProps.databaseId || this.props.storeId!==prevProps.storeId) {
      this.loadDatabase();
    }
  }

  resizeElementsTo(dim) {
    const state = super.resizeElementsTo(dim);
    const meta = this.refs.grid;
    if(meta) {
        const metaElt = ReactDOM.findDOMNode(meta);
        const metaTop = metaElt.getBoundingClientRect().top;
        const metaHeight = Math.max( dim.footerTop-metaTop ,250);
        state.metaHeight = metaHeight;
    }
    return state;
  }
 
  getCount() {
    return this.refs.count;
  }

  loadDatabase() {
    globalState.database(this.props.databaseId).then( database => {
      let ftEnabled = false; 
      Object.keys(database.stores).forEach( (k) => {
        const st = database.stores[k]
        if(st.fulltextEnabled && (!this.props.storeId || this.props.storeId===st.id) ) {
          ftEnabled = true;
        }
      }) 
      this.setState({database,ftEnabled});
    }).catch( (error) => {
      this.setState({error});
    });    
  }

  reinitData() {
    this.getGrid().reinitData();
    this.getCount().reinitData()
  }

  onSearch(params) {
    this.setState({params})
  }

  onNewDocument(e) {
    this.context.tabManager.newDocument(this.props.databaseId,this.props.storeId);
  }

  onRowDblClick(e) {
    const { unid, storeId } = e.__meta;
    this.context.tabManager.openTab("document",[this.props.databaseId,storeId,unid].join(':'))
  }

  onDeleteDocuments() {
    if(this.getGrid()) {
        const p = this.getGrid().handleDeleteSelectedDocuments();
        p && p.then(this.reinitData);
    }
  }

  render() {
    if(this.state.error) {
      return this.renderError();
    }
    return this.renderDatabase();
  }

  
  renderError() {
    return (
      <div>
        <h2>Error while loading database {this.props.databaseId}</h2>
        <code>
          <pre>
            {JSON.stringify(this.state.error,null,2)}
          </pre>
        </code>
      </div>      
    );
  }
  renderDatabase() {
    const database = this.state.database;
    const columns=[];
    if(!this.props.storeId) {
      columns.push({name: "Store", key: "storeId", formatter: StoreIdFormatter, resizable:true, sortable: true, sortField: 'storeId', width:100});
    }
    columns.push(
      {name: "Unid", key: "unid", formatter: UnidFormatter, resizable:true, sortable: true, sortField: '_unid', width:200},
      {name: "Json", key: "json", formatter: JsonFormatter, resizable:true, sortable: true}
    );
    return (
      <div>
        <h5>
          Database: <span>{this.props.databaseId}, </span> 
          { this.props.storeId && (<span>Store: {this.props.storeId}, </span>) }
          Documents: <CursorCount ref="count" databaseId={this.props.databaseId} storeId={this.props.storeId} params={this.state.params}/>
        </h5>
        <ButtonToolbar>
          <Button bsStyle="primary" type="button" onClick={this.reinitData}>Refresh</Button>
          <Button bsStyle="primary" type="button" onClick={this.onNewDocument}>New Document</Button>
          <div className="pull-right">
            <Button onClick={this.onDeleteDocuments} disabled={!this.getGrid() || this.getGrid().hasSelectedEntries()} bsStyle="danger">Delete Documents...</Button>
          </div>
        </ButtonToolbar>

        <MaterialDesignTabs defaultActiveKey={1} id="uncontrolled-tab-example">
          <Tab eventKey={1} title="Data">
            <Section title="Query" defaultExpanded={false} hidePanel={true}>
              <SearchQuery onSearch={this.onSearch} ftEnabled={this.state.ftEnabled}/>
            </Section>
            <CursorGrid ref="grid" 
                height={this.state.gridHeight}
                databaseId={this.props.databaseId}
                storeId={this.props.storeId}
                selectRows={true}
                responsive={true}
                params={this.state.params}
                columns={columns}
                onRowDoubleClicked={this.onRowDblClick}
            />        
          </Tab>
          <Tab eventKey={2} title="Meta Data">
            <CodeEditor ref="meta" 
                mode="json" 
                readOnly={true} 
                value={database ? stringifySorted(this.props.storeId ? database.stores[this.props.storeId] : database) : ""} 
                width='100%'
                height={''+this.state.metaHeight+'px'}
              />
          </Tab>
        </MaterialDesignTabs>
      </div>
    );
  }
}