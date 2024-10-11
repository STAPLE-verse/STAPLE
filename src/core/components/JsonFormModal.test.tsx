/**
 * @vitest-environment jsdom
 */

import { expect, test } from "vitest"
import { fireEvent, render, screen, within } from "test/utils"
import { JsonFormModal } from "./JsonFormModal"

const BasicSchema = `
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "title": "Basic Json Schema",
  "description": "Information about a project",
  "properties": {
    "owner": {
      "title": "Name of owner:",
      "type": "string"
    },
    "description": {
      "title": "Description of the project: ",
      "type": "string"
    },
    "id": {
      "title": "Project id:",
      "type": "string"
    },
    "comment":{
      "tile": "Comments",
      "type": "string"
    }
  },
  "dependencies": {},
  "required": [
    "owner",
    "description",
    "id"
  ]
}
`

export const BasicSchemaUI = `
{
  "ui:order": [
    "owner",
    "description",
    "id",
    "comment"
  ]
}
`

function extendBasicSchema() {
  const parsed = JSON.parse(BasicSchema)
  const uiparse = JSON.parse(BasicSchemaUI)
  return {
    label: parsed.title,
    id: 1,
    schema: parsed,
    uiSchema: uiparse,
  }
}

test("JsonFormModal with basic schema and valid uischema", async () => {
  const basicSchema = extendBasicSchema()
  render(
    <JsonFormModal
      schema={basicSchema.schema}
      uiSchema={basicSchema.uiSchema}
      label={"Basic Schema"}
      classNames={""}
    ></JsonFormModal>
  )

  const openModalBtn = screen.getByTestId("jsonformmodal-btid")
  expect(openModalBtn).toBeInTheDocument()
  expect(openModalBtn).toHaveAttribute("type", "button")
  fireEvent.click(openModalBtn)
  expect(screen.getByText(/basic json schema/i)).toBeInTheDocument()
  expect(screen.getByText(/information about a project/i)).toBeInTheDocument()

  const oView = screen.getByText(/name of owner:/i)
  expect(oView).toBeInTheDocument()
  expect(within(oView).getByText(/\*/i)).toBeInTheDocument()

  const dView = screen.getByText(/description of the project:/i)
  expect(dView).toBeInTheDocument()
  expect(within(dView).getByText(/\*/i)).toBeInTheDocument()

  const pView = screen.getByText(/project id:/i)
  expect(pView).toBeInTheDocument()
  expect(within(pView).getByText(/\*/i)).toBeInTheDocument()

  const cView = screen.getByText(/comment/i)
  expect(cView).toBeInTheDocument()
  expect(within(cView).queryByText(/\*/i)).not.toBeInTheDocument()

  const submitBtn = screen.getByRole("button", {
    name: /submit/i,
  })
  expect(submitBtn).toBeInTheDocument()

  const inputs = screen.queryAllByRole("textbox")
  expect(inputs).not.toBeNull()
  expect(inputs.length).equal(4)

  const closeBtn = screen.getByRole("button", {
    name: /close/i,
  })
  expect(closeBtn).toBeInTheDocument()
  fireEvent.click(closeBtn)
  expect(closeBtn).not.toBeInTheDocument()
  expect(screen.queryByText(/basic json schema/i)).not.toBeInTheDocument()
  expect(submitBtn).not.toBeInTheDocument()
})
