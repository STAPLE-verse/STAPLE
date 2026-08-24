/**
 * @vitest-environment node
 */

import {
  projectSemanticV1,
  validateCoreV1,
  validateSemanticV1,
} from "@staple-verse/marker-template-runtime"
import jsonld from "jsonld"
import { describe, expect, test } from "vitest"
import legacyFixture from "src/forms/fixtures/projectMemberLegacyV1.json"
import { projectMemberTemplatePackageV1 } from "src/forms/templates/projectMemberTemplateV1"
import { mapStapleToJsonLd } from "src/forms/utils/mapStapleToJsonLd"
import { projectMetadataResponse } from "./projectMetadataResponse"
import { getDefaultSchemaLists } from "src/forms/utils/getDefaultSchemaList"

const projectMemberResponse = {
  givenName: "Ada",
  additionalName: "Lovelace",
  familyName: "Byron",
  email: "ada@example.edu",
  identifier: "https://orcid.org/0000-0002-1825-0097",
}

const expectedProjectMemberExpandedJsonLd = [
  {
    "@type": ["https://schema.org/Person"],
    "https://schema.org/givenName": [
      {
        "@value": "Ada",
        "@type": "http://www.w3.org/2001/XMLSchema#string",
      },
    ],
    "https://schema.org/additionalName": [
      {
        "@value": "Lovelace",
        "@type": "http://www.w3.org/2001/XMLSchema#string",
      },
    ],
    "https://schema.org/familyName": [
      {
        "@value": "Byron",
        "@type": "http://www.w3.org/2001/XMLSchema#string",
      },
    ],
    "https://schema.org/email": [
      {
        "@value": "ada@example.edu",
        "@type": "http://www.w3.org/2001/XMLSchema#string",
      },
    ],
    "https://schema.org/identifier": [
      {
        "@id": "https://orcid.org/0000-0002-1825-0097",
      },
    ],
  },
]

const offlineDocumentLoader = async (url: string): Promise<never> => {
  throw new Error(`JSON-LD validation attempted to load remote document ${url}`)
}

async function canonicalize(document: unknown): Promise<string> {
  return jsonld.canonize(document as any, {
    algorithm: "RDFC-1.0",
    format: "application/n-quads",
    documentLoader: offlineDocumentLoader as any,
  }) as Promise<string>
}

describe("Project Member Semantic V1 migration", () => {
  test("locks the legacy response and compact JSON-LD behavior", () => {
    expect(mapStapleToJsonLd(legacyFixture.response)).toEqual(legacyFixture.expectedJsonLd)
  })

  test("is a valid Core V1 package with a valid Semantic V1 component", () => {
    expect(validateCoreV1(projectMemberTemplatePackageV1)).toEqual([])
    expect(validateSemanticV1(projectMemberTemplatePackageV1)).toEqual([])
    expect(projectMemberTemplatePackageV1.form.schema.properties).not.toHaveProperty(
      "_stapleSchema"
    )
    const deployedTemplate = getDefaultSchemaLists().find(
      (template) => template.label === "Contributor Information"
    )
    expect(deployedTemplate).toMatchObject({
      semantics: projectMemberTemplatePackageV1.semantics,
    })
  })

  test("projects the migrated response to deterministic expanded JSON-LD", () => {
    const result = projectSemanticV1(projectMemberTemplatePackageV1, projectMemberResponse)

    expect(result.diagnostics).toEqual([])
    expect(result.expandedJsonLd).toEqual(expectedProjectMemberExpandedJsonLd)
  })

  test("uses Semantic V1 only when a FormVersion declares semantics", () => {
    const semanticResult = projectMetadataResponse(projectMemberResponse, {
      schema: projectMemberTemplatePackageV1.form.schema,
      semantics: projectMemberTemplatePackageV1.semantics,
    })
    const legacyResult = projectMetadataResponse(legacyFixture.response, {
      schema: {},
      semantics: null,
    })

    expect(semanticResult).toEqual({
      mode: "semantic-v1",
      jsonLd: expectedProjectMemberExpandedJsonLd,
      diagnostics: [],
    })
    expect(legacyResult).toEqual({
      mode: "legacy-staple",
      jsonLd: legacyFixture.expectedJsonLd,
      diagnostics: [],
    })

    const invalidSemanticResult = projectMetadataResponse(
      { ...projectMemberResponse, identifier: "not-an-iri" },
      {
        schema: projectMemberTemplatePackageV1.form.schema,
        semantics: projectMemberTemplatePackageV1.semantics,
      }
    )
    expect(invalidSemanticResult.mode).toBe("semantic-v1")
    expect(invalidSemanticResult.jsonLd).toBeNull()
    expect(invalidSemanticResult.diagnostics).toEqual([
      expect.objectContaining({ code: "PROJECTION_IRI_INVALID", pointer: "/identifier" }),
    ])
  })

  test("produces independently valid JSON-LD and records the intentional ORCID improvement", async () => {
    const projected = projectSemanticV1(projectMemberTemplatePackageV1, projectMemberResponse)
    expect(projected.expandedJsonLd).not.toBeNull()

    const independentlyExpanded = await jsonld.expand(projected.expandedJsonLd as any, {
      documentLoader: offlineDocumentLoader as any,
    })
    expect(await canonicalize(independentlyExpanded)).toBe(
      await canonicalize(projected.expandedJsonLd)
    )

    const legacyWithOfflineContext = {
      ...legacyFixture.expectedJsonLd,
      "@context": { "@vocab": "https://schema.org/" },
    }
    expect(await canonicalize(legacyWithOfflineContext)).not.toBe(
      await canonicalize(projected.expandedJsonLd)
    )

    const legacyWithoutIdentifier = { ...legacyWithOfflineContext }
    delete (legacyWithoutIdentifier as Record<string, unknown>).identifier
    const semanticWithoutIdentifier = structuredClone(projected.expandedJsonLd) as Array<
      Record<string, unknown>
    >
    delete semanticWithoutIdentifier[0]?.["https://schema.org/identifier"]

    expect(await canonicalize(legacyWithoutIdentifier)).toBe(
      await canonicalize(semanticWithoutIdentifier)
    )
  })
})
