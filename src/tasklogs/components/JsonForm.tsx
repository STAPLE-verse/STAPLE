import React from "react"
import validator from "@rjsf/validator-ajv8"
import { withTheme } from "@rjsf/core"
import DaisyTheme from "src/services/jsonconverter/DaisyTheme"

const ThemedForm = withTheme(DaisyTheme)

const JsonForm = ({ schema, ...rest }) => {
  return <div>{<ThemedForm schema={schema} validator={validator} {...rest} />}</div>
}

export default JsonForm
