import { readFileSync } from "node:fs"
import path from "node:path"
import validator from "@rjsf/validator-ajv8"
import { describe, expect, test } from "vitest"
import getJsonSchema from "./getJsonSchema"

const activeValidator = "rawValidation" in validator ? validator : (validator as any).default
const fixturePath = path.join(
  process.env.MARKER_TEMPLATE_SPEC_ROOT ?? path.resolve(process.cwd(), "../marker-template-spec"),
  "fixtures",
  "v1",
  "capabilities",
  "local-reference.json"
)

interface LocalReferenceFixture {
  schema: Record<string, any>
  instances: {
    valid: Array<{ data: Record<string, unknown> }>
    invalid: Array<{ data: Record<string, unknown> }>
  }
}

function loadFixture(): LocalReferenceFixture {
  return JSON.parse(readFileSync(fixturePath, "utf8"))
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

describe("getJsonSchema", () => {
  test("returns an independent deployment copy without removing local-reference vocabulary", () => {
    const fixture = loadFixture()
    const sourceSchema = clone(fixture.schema)
    const sourceSnapshot = clone(sourceSchema)

    const deployedSchema = getJsonSchema(sourceSchema)

    expect(deployedSchema).not.toBe(sourceSchema)
    expect(sourceSchema).toEqual(sourceSnapshot)
    expect(deployedSchema).toEqual(sourceSnapshot)
    expect(deployedSchema.$schema).toBe("http://json-schema.org/draft-07/schema#")
    expect(deployedSchema.$id).toBe("urn:marker:fixture:local-reference")
    expect(deployedSchema.definitions).toEqual(sourceSnapshot.definitions)
    expect(deployedSchema.properties.identifier.$ref).toBe("#/definitions/identifier")
  })

  test("retains the referenced minLength constraint during deployment validation", () => {
    const fixture = loadFixture()
    const deployedSchema = getJsonSchema(fixture.schema)

    expect(
      activeValidator.rawValidation(deployedSchema, fixture.instances.valid[0].data).errors
        ?.length ?? 0
    ).toBe(0)
    expect(
      activeValidator.rawValidation(deployedSchema, fixture.instances.invalid[0].data).errors
        ?.length ?? 0
    ).toBeGreaterThan(0)
  })
})
