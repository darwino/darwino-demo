/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React, {Component} from "react";
import { Col } from 'react-onsenui';

class InputBlock extends Component {

    render() {
        const {horizontal, inline, label, meta} = this.props
        if(horizontal) {
            return (
                <div className={meta.touched && meta.error ? 'has-error' : ''}>
                    <Col componentClass={ControlLabel} sm={2}>
                        {label}
                    </Col>
                    <Col sm={10}>
                        {this.props.children}
                    </Col>
                    {meta.touched && meta.error && <div className="error">{meta.error}</div>}
                </div>
            )
        } else {
            return (
                <div className={meta.touched && meta.error ? 'has-error' : ''}>
                    {label && <div>{label}</div>}
                    {inline && ' '}
                    {this.props.children}
                    {meta.touched && meta.error && <div className="error">{meta.error}</div>}
                </div>
            )
        }
    }
};

export default InputBlock
