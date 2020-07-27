/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React, { Component } from "react";
import { DropdownButton, ControlLabel, MenuItem, Form, Button, ButtonToolbar, FormControl, InputGroup} from "react-bootstrap";

const QUERIES = [
    '{FIELD: "VALUE"}',
    '{FIELD1: "VALUE1", FIELD2: "VALUE2"}',
    '{$and: [{FIELD1: "VALUE1"}, {FIELD2: "VALUE2"}]',
]
class SearchQuery extends Component {
    constructor(props) {
        super(props)
        this.onChangeUnid = this.onChangeUnid.bind(this);
        this.onChangeQry = this.onChangeQry.bind(this);
        this.onChangeFt = this.onChangeFt.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onClear = this.onClear.bind(this);
        this.state = {
            unid: "",
            query: "",
            ftsearch: ""
        }
    }
    onChangeUnid(e) {
        this.setState({unid:e.target.value})
    }
    onChangeQry(e) {
        this.setState({query:e.target.value})
    }
    onChangeFt(e) {
        this.setState({ftsearch:e.target.value})
    }
    onKeyDown(e) {
        if(e.key==='Enter') {
            this.onSearch();
        }
    }
    onSearch() {
        if(this.props.onSearch) {
            const s= this.state;
            this.props.onSearch({unid:s.unid,query:s.query,ftsearch:s.ftsearch});
        }
    }
    onClear() {
        this.setState( {
            unid: "",
            query: "",
            ftsearch: ""
        })
        if(this.props.onSearch) {
            this.props.onSearch({unid:"",query:"",ftsearch:""});
        }
    }
    render() {
        const state = this.state;
        return (
            <Form horizontal>
                <div className="form-group row">
                    <div className="col-xs-3">
                        <ControlLabel>UNID</ControlLabel>
                        <FormControl type="text" value={state.unid} onKeyDown={this.onKeyDown} onChange={this.onChangeUnid}/>
                    </div>
                    <div className="col-xs-5">
                        <ControlLabel>Query</ControlLabel>
                        <InputGroup>
                            <InputGroup.Button>
                                <DropdownButton
                                    componentClass={InputGroup.Button}
                                >
                                {QUERIES.map( (s,i) => {
                                    return (<MenuItem key={i} onSelect={(e) => this.setState({query:s})}>{s}</MenuItem>)
                                })}
                                <MenuItem href="https://documentation.darwino.com/doc/developer/Appendix%203.%20The%20Query%20Language.html" target="_blank">Documentation...</MenuItem>
                                </DropdownButton>
                            </InputGroup.Button>
                            <FormControl type="text" value={state.query} onKeyDown={this.onKeyDown} onChange={this.onChangeQry}/>
                        </InputGroup>
                    </div>
                    {this.props.ftEnabled && (
                    <div className="col-xs-4">
                        <ControlLabel>Full Text</ControlLabel>
                        <FormControl type="text" value={state.ftsearch} onKeyDown={this.onKeyDown} onChange={this.onChangeFt}/>
                    </div>)}
                </div>
                <ButtonToolbar>
                    <Button onClick={this.onSearch} bsStyle="primary">Search</Button>
                    <Button onClick={this.onClear} bsStyle="link">Clear</Button>
                </ButtonToolbar>
            </Form>
        );
    }
}

export default SearchQuery
