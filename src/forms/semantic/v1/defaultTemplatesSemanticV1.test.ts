/**
 * @vitest-environment node
 */

import {
  projectSemanticV1,
  validateCoreV1,
  validateSemanticV1,
} from "@staple-verse/marker-template-runtime"
import { describe, expect, test } from "vitest"
import {
  dataTemplatePackageV1,
  documentTemplatePackageV1,
  funderTemplatePackageV1,
  organizationTemplatePackageV1,
  projectTemplatePackageV1,
  remainingDefaultTemplatePackagesV1,
} from "src/forms/templates/defaultTemplatePackagesV1"
import { projectMemberTemplatePackageV1 } from "src/forms/templates/projectMemberTemplateV1"
import { getDefaultSchemaLists } from "src/forms/utils/getDefaultSchemaList"
import { projectMetadataResponse } from "./projectMetadataResponse"

const allDefaultPackages = [
  projectMemberTemplatePackageV1,
  ...remainingDefaultTemplatePackagesV1,
] as const

describe("remaining default template Semantic V1 migrations", () => {
  test.each(
    allDefaultPackages.map((templatePackage) => [templatePackage.metadata.title, templatePackage])
  )("%s conforms to Core V1 and Semantic V1", (_title, templatePackage) => {
    expect(validateCoreV1(templatePackage)).toEqual([])
    expect(validateSemanticV1(templatePackage)).toEqual([])
    expect(templatePackage.form.schema.properties).not.toHaveProperty("_stapleSchema")
    expect(templatePackage.form.uiSchema).not.toHaveProperty("_stapleSchema")
    expect(templatePackage.form.uiSchema["ui:order"]).not.toContain("_stapleSchema")
  })

  test("deploys every default with its exact Semantic V1 component", () => {
    const deployedTemplates = getDefaultSchemaLists()

    expect(deployedTemplates).toHaveLength(allDefaultPackages.length)
    for (const templatePackage of allDefaultPackages) {
      expect(deployedTemplates).toContainEqual(
        expect.objectContaining({
          label: templatePackage.metadata.title,
          schema: templatePackage.form.schema,
          uiSchema: templatePackage.form.uiSchema,
          semantics: templatePackage.semantics,
        })
      )
    }
  })

  test.each([
    {
      title: "Funding for Contributor or Project",
      templatePackage: funderTemplatePackageV1,
      response: {
        funder: "Example Foundation",
        identifier: "https://ror.org/03yrm5c26",
        awardTitle: "Open Metadata Award",
        description: "Supports reusable metadata infrastructure.",
      },
      typeIri: "https://schema.org/FundingAgency",
      predicate: "https://schema.org/award",
      expectedValue: "Open Metadata Award",
    },
    {
      title: "Project Information",
      templatePackage: projectTemplatePackageV1,
      response: {
        name: "FAIR Templates",
        abstract: "A metadata interoperability project.",
        citation: "Example citation retained only in raw JSON.",
        keywords: "FAIR, metadata",
        publisher: "Example University",
        identifier: "doi:10.1234/example",
        license: "CC-BY-4.0",
      },
      typeIri: "https://schema.org/ResearchProject",
      predicate: "https://schema.org/keywords",
      expectedValue: "FAIR, metadata",
    },
    {
      title: "Research Data",
      templatePackage: dataTemplatePackageV1,
      response: {
        title: "Example dataset",
        description: "A portable example.",
        identifier: "doi:10.1234/data",
        creator: "Example Researcher",
        dateCreated: "2026-08-24",
        license: "CC-BY-4.0",
        dataType: "Tabular",
        format: "text/csv",
        language: "en",
        version: "1.0.0",
        conformsTo: "DataCite 4.6",
        isAccessibleForFree: false,
      },
      typeIri: "https://schema.org/Dataset",
      predicate: "https://schema.org/encodingFormat",
      expectedValue: "text/csv",
    },
    {
      title: "Project Document",
      templatePackage: documentTemplatePackageV1,
      response: {
        documentCategory: "Generic",
        title: "Analysis plan",
        type: "Analysis code",
        creator: "Example Researcher",
        dateCreated: "2026-08-24",
        identifier: "doi:10.1234/document",
        description: "The analysis plan.",
        license: "CC-BY-4.0",
        language: "en",
        fileFormat: "application/pdf",
      },
      typeIri: "https://schema.org/MediaObject",
      predicate: "https://schema.org/encodingFormat",
      expectedValue: "application/pdf",
    },
    {
      title: "Organization",
      templatePackage: organizationTemplatePackageV1,
      response: {
        name: "Example University",
        identifier: "https://ror.org/03yrm5c26",
        url: "https://example.edu",
        city: "Example City",
        country: "Example Country",
      },
      typeIri: "https://schema.org/Organization",
      predicate: "https://schema.org/url",
      expectedId: "https://example.edu",
    },
  ])(
    "projects $title deterministically",
    ({ templatePackage, response, typeIri, predicate, expectedValue, expectedId }) => {
      const result = projectSemanticV1(templatePackage, response)

      expect(result.diagnostics).toEqual([])
      expect(result.expandedJsonLd).toHaveLength(1)
      expect(result.expandedJsonLd?.[0]?.["@type"]).toEqual([typeIri])
      if (expectedValue !== undefined) {
        expect(result.expandedJsonLd?.[0]?.[predicate]).toEqual([
          expect.objectContaining({ "@value": expectedValue }),
        ])
      }
      if (expectedId !== undefined) {
        expect(result.expandedJsonLd?.[0]?.[predicate]).toEqual([{ "@id": expectedId }])
      }
    }
  )

  test.each([
    ["funder-v1", "FundingAgency"],
    ["project-v1", "ResearchProject"],
    ["data-v1", "Dataset"],
    ["document-v1", "MediaObject"],
    ["organization-v1", "Organization"],
  ])("keeps %s responses on the legacy projector", (schemaVersion, expectedType) => {
    const result = projectMetadataResponse(
      { _stapleSchema: schemaVersion, name: "Legacy value" },
      { schema: {}, semantics: null }
    )

    expect(result.mode).toBe("legacy-staple")
    expect(result.diagnostics).toEqual([])
    expect(result.jsonLd).toEqual(
      expect.objectContaining({ "@context": "https://schema.org", "@type": expectedType })
    )
  })
})
