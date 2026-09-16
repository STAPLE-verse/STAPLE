/**
 * @vitest-environment jsdom
 */

import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { cleanup, render } from "@testing-library/react"
import { JsonSchemaForm } from "@staple-verse/form-studio"
import validator from "@rjsf/validator-ajv8"
import { afterEach, describe, expect, test, vi } from "vitest"
import getJsonSchema from "./getJsonSchema"

const activeValidator = "rawValidation" in validator ? validator : (validator as any).default

type Status = "pass" | "lossy" | "unsupported" | "blocked" | "unverified"

interface InstanceExample {
  label: string
  data: Record<string, unknown>
}

interface CapabilityFixture {
  id: string
  schema: Record<string, any>
  uiSchema: Record<string, any>
  instances: {
    valid: InstanceExample[]
    invalid: InstanceExample[]
  }
  expectations: {
    stapleDeployment: { status: Status }
  }
}

const fixtureRoot = path.join(
  process.env.MARKER_TEMPLATE_SPEC_ROOT ?? path.resolve(process.cwd(), "../marker-template-spec"),
  "fixtures",
  "v1",
  "capabilities"
)

function loadFixtures(): CapabilityFixture[] {
  return readdirSync(fixtureRoot)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => JSON.parse(readFileSync(path.join(fixtureRoot, file), "utf8")))
}

function hasExpectedValidationBehavior(
  schema: Record<string, any>,
  fixture: CapabilityFixture
): boolean {
  const validExamplesPass = fixture.instances.valid.every(
    (example) => (activeValidator.rawValidation(schema, example.data).errors?.length ?? 0) === 0
  )
  const invalidExamplesFail = fixture.instances.invalid.every(
    (example) => (activeValidator.rawValidation(schema, example.data).errors?.length ?? 0) > 0
  )
  return validExamplesPass && invalidExamplesFail
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("current STAPLE deployment integration", () => {
  test.each(loadFixtures())("classifies $id", (fixture) => {
    vi.spyOn(console, "error").mockImplementation(() => undefined)
    vi.spyOn(console, "warn").mockImplementation(() => undefined)

    const deployedSchema = getJsonSchema(fixture.schema)
    const deployedUiSchema = getJsonSchema(fixture.uiSchema)
    const validationPreserved = hasExpectedValidationBehavior(deployedSchema, fixture)

    const { container } = render(
      <JsonSchemaForm
        schema={deployedSchema}
        uiSchema={deployedUiSchema}
        formData={fixture.instances.valid[0]?.data}
      />
    )
    expect(container.querySelector("form")).not.toBeNull()

    const legacyTextareaLost =
      fixture.id === "legacy-textarea-format" && container.querySelector("textarea") === null
    const status: Status = !validationPreserved ? "blocked" : legacyTextareaLost ? "lossy" : "pass"

    expect(status).toBe(fixture.expectations.stapleDeployment.status)
  })
})
