import React from "react"
import { RJSFSchema } from "@rjsf/utils"
import validator from "@rjsf/validator-ajv8"
import Form from "@rjsf/core"
import testJson2 from "./testjson2.js"

const schema: RJSFSchema = JSON.parse(testJson2)

const JsonForm = () => {
  // const schema = JSON.parse(testJson2)
  console.log(schema)
  return <div>{<Form schema={schema} validator={validator} />}</div>
}

export default JsonForm
