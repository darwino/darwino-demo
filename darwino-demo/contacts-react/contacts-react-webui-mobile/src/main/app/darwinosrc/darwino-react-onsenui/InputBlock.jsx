/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React, {Component} from "react";
import { ListItem } from 'react-onsenui';

class InputBlock extends Component {

    render() {
        const {horizontal, inline, label, meta} = this.props
        if(horizontal) {
            return (
                <ListItem modifier="nodivider" className={meta.touched && meta.error ? 'has-error' : ''}>
                    <label className="left left-label">
                        {label}
                    </label>
                    <div className="center">
                        {this.props.children}
                    </div>
                    {meta.touched && meta.error && <div className="error">{meta.error}</div>}
                </ListItem>
            )
        } else {
            return (
                <ListItem modifier="nodivider" className={meta.touched && meta.error ? 'has-error' : ''}>
                    <div>
                        <label>
                            {label && <div>{label}</div>}
                        </label>
                        <div>
                            {this.props.children}
                        </div>
                        {meta.touched && meta.error && <div className="error">{meta.error}</div>}
                    </div>
                </ListItem>
            )
        }
    }
};

export default InputBlock
