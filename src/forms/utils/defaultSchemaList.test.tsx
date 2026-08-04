/**
 * @vitest-environment jsdom
 */

import { cleanup, render } from "@testing-library/react"
import { withTheme } from "@rjsf/core"
import validator from "@rjsf/validator-ajv8"
import { afterEach, describe, expect, test, vi } from "vitest"
import DaisyTheme from "src/core/components/DaisyTheme"
import { getDefaultSchemaLists } from "./getDefaultSchemaList"
import getJsonSchema from "./getJsonSchema"

const activeValidator = "rawValidation" in validator ? validator : (validator as any).default
const DeployedForm = withTheme(DaisyTheme)

const builtInExamples = [
  {
    label: "Contributor Information",
    valid: {
      givenName: "Ada",
      familyName: "Lovelace",
      email: "ada@example.edu",
      identifier: "https://orcid.org/0000-0000-0000-0000",
    },
  },
  {
    label: "Funding for Contributor or Project",
    valid: {
      funder: "Example Foundation",
      identifier: "https://ror.org/00example",
      description: "Research grant",
    },
  },
  {
    label: "Project Information",
    valid: {
      name: "Example project",
      identifier: "https://doi.org/10.1234/example",
      keywords: "metadata, FAIR",
    },
  },
  {
    label: "Research Data",
    valid: {
      title: "Example dataset",
      identifier: "https://doi.org/10.1234/data",
      format: "CSV",
      dateCreated: "2026-08-04",
      dataType: "Other",
    },
  },
  {
    label: "Project Document",
    valid: {
      title: "Analysis plan",
      type: "Protocol",
      dateCreated: "2026-08-04",
      identifier: "https://doi.org/10.1234/document",
      documentCategory: "Generic",
    },
  },
  {
    label: "Organization",
    valid: {
      name: "Example University",
      identifier: "https://ror.org/00example",
    },
  },
]

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("STAPLE built-in form deployment", () => {
  test.each(builtInExamples)("renders and validates $label", ({ label, valid }) => {
    vi.spyOn(console, "error").mockImplementation(() => undefined)
    vi.spyOn(console, "warn").mockImplementation(() => undefined)

    const template = getDefaultSchemaLists().find((candidate) => candidate.label === label)
    expect(template).toBeDefined()

    const schema = getJsonSchema(template!.schema)
    const uiSchema = getJsonSchema(template!.uiSchema)

    expect(schema.$schema).toBe("http://json-schema.org/draft-07/schema#")
    expect(activeValidator.rawValidation(schema, valid).errors?.length ?? 0).toBe(0)
    expect(activeValidator.rawValidation(schema, {}).errors?.length ?? 0).toBeGreaterThan(0)

    const { container } = render(
      <DeployedForm
        schema={schema}
        uiSchema={uiSchema}
        formData={valid}
        validator={activeValidator}
      />
    )
    expect(container.querySelector("form")).not.toBeNull()
  })

  test.each(["Research Data", "Project Document"])(
    "%s uses the portable textarea representation",
    (label) => {
      const template = getDefaultSchemaLists().find((candidate) => candidate.label === label)
      expect(template).toBeDefined()

      expect(template!.schema.properties.description).not.toHaveProperty("format")
      expect(template!.uiSchema.description).toEqual({ "ui:widget": "textarea" })

      const { container } = render(
        <DeployedForm
          schema={template!.schema}
          uiSchema={template!.uiSchema}
          validator={activeValidator}
        />
      )
      expect(container.querySelector("textarea")).not.toBeNull()
    }
  )
})
