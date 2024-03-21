import React from "react"
import validator from "@rjsf/validator-ajv8"
import { withTheme, ThemeProps } from "@rjsf/core"
import DaisyTheme from "src/services/jsonconverter/DaisyTheme"

const ThemedForm = withTheme(DaisyTheme)

const JsonForm = (props) => {
  const { schema, ...rest } = props

  return <div>{<ThemedForm schema={schema} validator={validator} {...rest} />}</div>
}

export default JsonForm
