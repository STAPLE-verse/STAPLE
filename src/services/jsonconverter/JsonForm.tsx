import React from "react"
import { RJSFSchema } from "@rjsf/utils"
import validator from "@rjsf/validator-ajv8"
import Form from "@rjsf/core"
import { withTheme, ThemeProps } from "@rjsf/core"
import DaisyTheme from "./DaisyTheme"
import testJson2 from "./testjson2.js"

const schema: RJSFSchema = JSON.parse(testJson2)

const ThemedForm = withTheme(DaisyTheme)
const JsonForm = () => {
  // const schema = JSON.parse(testJson2)
  console.log(schema)
  return <div>{<ThemedForm schema={schema} validator={validator} />}</div>
}

export default JsonForm
