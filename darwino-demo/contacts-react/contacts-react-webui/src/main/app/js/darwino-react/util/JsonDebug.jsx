/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from 'react'
import { values as valuesDecorator } from 'redux-form'

/*
 * Used to debug the content of a JSON document, particularly within a form
 * Usage
 *   <JsonDebug form={this.props.form}/>
 */
const JsonDebug = ({force,form,value}) => {
  if(form) {
    const decorator = valuesDecorator({ form })
    const component = ({ values }) =>
      (
          <pre style={{'marginTop': '1em','marginBottom': '1em'}}>{JSON.stringify(values,null,2)}</pre>
      )
    const Decorated = decorator(component)
    return <Decorated/>
  } else {
      return (
          <pre style={{'marginTop': '1em','marginBottom': '1em'}}>{JSON.stringify(value,null,2)}</pre>
      )
  }
}

export default JsonDebug