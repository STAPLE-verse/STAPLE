import { JsonData, JsonDataUI } from "src/forms/schema/dataSchema"
import { JsonDocument, JsonDocumentUI } from "src/forms/schema/documentSchema"
import { JsonFunder, JsonFunderUI } from "src/forms/schema/funderSchema"
import { JsonOrganization, JsonOrganizationUI } from "src/forms/schema/organizationSchema"
import { JsonProject, JsonProjectUI } from "src/forms/schema/projectSchema"
import { MARKER_CORE_V1_PROFILE, MARKER_SEMANTIC_V1_PROFILE } from "./projectMemberTemplateV1"

type JsonObject = Record<string, any>

interface DraftTemplateIdentity {
  familyId: string
  versionId: string
  title: string
}

function migrateLegacyForm(schemaJson: string, uiSchemaJson: string) {
  const schema = JSON.parse(schemaJson) as JsonObject
  const uiSchema = JSON.parse(uiSchemaJson) as JsonObject

  delete schema.properties?._stapleSchema
  delete uiSchema._stapleSchema
  if (Array.isArray(uiSchema["ui:order"])) {
    uiSchema["ui:order"] = uiSchema["ui:order"].filter(
      (fieldName: unknown) => fieldName !== "_stapleSchema"
    )
  }

  return { schema, uiSchema }
}

function draftMetadata({ familyId, versionId, title }: DraftTemplateIdentity) {
  return {
    familyId,
    versionId,
    version: "draft-1",
    status: "draft",
    resourceType: "MetadataTemplate",
    title,
    createdAt: "2026-08-24T00:00:00Z",
    updatedAt: "2026-08-24T00:00:00Z",
  } as const
}

export const funderTemplatePackageV1 = {
  conformsTo: [MARKER_CORE_V1_PROFILE, MARKER_SEMANTIC_V1_PROFILE],
  metadata: draftMetadata({
    familyId: "urn:uuid:900e26d1-2e2f-4dd1-966e-908f89572f8d",
    versionId: "urn:uuid:95b3467d-55f9-424c-bed1-77e0dd94f9be",
    title: "Funding for Contributor or Project",
  }),
  form: migrateLegacyForm(JsonFunder, JsonFunderUI),
  semantics: {
    root: { classIri: "https://schema.org/FundingAgency" },
    bindings: [
      {
        fieldPointer: "/properties/funder",
        predicate: "https://schema.org/name",
        valueKind: "literal",
      },
      {
        fieldPointer: "/properties/identifier",
        predicate: "https://schema.org/identifier",
        valueKind: "literal",
      },
      {
        fieldPointer: "/properties/awardTitle",
        predicate: "https://schema.org/award",
        valueKind: "literal",
      },
      {
        fieldPointer: "/properties/description",
        predicate: "https://schema.org/description",
        valueKind: "literal",
      },
    ],
  },
} as const

export const projectTemplatePackageV1 = {
  conformsTo: [MARKER_CORE_V1_PROFILE, MARKER_SEMANTIC_V1_PROFILE],
  metadata: draftMetadata({
    familyId: "urn:uuid:fb3da1c6-8e37-487a-90d1-f69519ee9b4a",
    versionId: "urn:uuid:1410a69f-145b-4058-83a0-cf7406a15a34",
    title: "Project Information",
  }),
  form: migrateLegacyForm(JsonProject, JsonProjectUI),
  semantics: {
    root: { classIri: "https://schema.org/ResearchProject" },
    bindings: [
      {
        fieldPointer: "/properties/name",
        predicate: "https://schema.org/name",
        valueKind: "literal",
      },
      {
        fieldPointer: "/properties/abstract",
        predicate: "https://schema.org/description",
        valueKind: "literal",
      },
      {
        fieldPointer: "/properties/keywords",
        predicate: "https://schema.org/keywords",
        valueKind: "literal",
      },
      {
        fieldPointer: "/properties/identifier",
        predicate: "https://schema.org/identifier",
        valueKind: "literal",
      },
    ],
  },
} as const

export const dataTemplatePackageV1 = {
  conformsTo: [MARKER_CORE_V1_PROFILE, MARKER_SEMANTIC_V1_PROFILE],
  metadata: draftMetadata({
    familyId: "urn:uuid:ead5f623-0af2-4296-8d29-9b48ca95a8e0",
    versionId: "urn:uuid:c3dfb3a5-8caf-4314-bd69-98b3ccd86d45",
    title: "Research Data",
  }),
  form: migrateLegacyForm(JsonData, JsonDataUI),
  semantics: {
    root: { classIri: "https://schema.org/Dataset" },
    bindings: [
      {
        fieldPointer: "/properties/title",
        predicate: "https://schema.org/name",
        valueKind: "literal",
      },
      {
        fieldPointer: "/properties/description",
        predicate: "https://schema.org/description",
        valueKind: "literal",
      },
      {
        fieldPointer: "/properties/identifier",
        predicate: "https://schema.org/identifier",
        valueKind: "literal",
      },
      {
        fieldPointer: "/properties/dateCreated",
        predicate: "https://schema.org/dateCreated",
        valueKind: "literal",
      },
      {
        fieldPointer: "/properties/dataType",
        predicate: "https://schema.org/additionalType",
        valueKind: "literal",
      },
      {
        fieldPointer: "/properties/format",
        predicate: "https://schema.org/encodingFormat",
        valueKind: "literal",
      },
      {
        fieldPointer: "/properties/language",
        predicate: "https://schema.org/inLanguage",
        valueKind: "literal",
      },
      {
        fieldPointer: "/properties/version",
        predicate: "https://schema.org/version",
        valueKind: "literal",
      },
      {
        fieldPointer: "/properties/conformsTo",
        predicate: "https://schema.org/conformsTo",
        valueKind: "literal",
      },
      {
        fieldPointer: "/properties/isAccessibleForFree",
        predicate: "https://schema.org/isAccessibleForFree",
        valueKind: "literal",
      },
    ],
  },
} as const

export const documentTemplatePackageV1 = {
  conformsTo: [MARKER_CORE_V1_PROFILE, MARKER_SEMANTIC_V1_PROFILE],
  metadata: draftMetadata({
    familyId: "urn:uuid:2a940af5-adca-4d74-b4c1-d84c52bdb7b7",
    versionId: "urn:uuid:eb5632eb-7a3c-4bf2-b3b3-06911653155a",
    title: "Project Document",
  }),
  form: migrateLegacyForm(JsonDocument, JsonDocumentUI),
  semantics: {
    root: { classIri: "https://schema.org/MediaObject" },
    bindings: [
      {
        fieldPointer: "/properties/documentCategory",
        predicate: "https://schema.org/genre",
        valueKind: "literal",
      },
      {
        fieldPointer: "/properties/title",
        predicate: "https://schema.org/name",
        valueKind: "literal",
      },
      {
        fieldPointer: "/properties/dateCreated",
        predicate: "https://schema.org/dateCreated",
        valueKind: "literal",
      },
      {
        fieldPointer: "/properties/identifier",
        predicate: "https://schema.org/identifier",
        valueKind: "literal",
      },
      {
        fieldPointer: "/properties/description",
        predicate: "https://schema.org/description",
        valueKind: "literal",
      },
      {
        fieldPointer: "/properties/language",
        predicate: "https://schema.org/inLanguage",
        valueKind: "literal",
      },
      {
        fieldPointer: "/properties/fileFormat",
        predicate: "https://schema.org/encodingFormat",
        valueKind: "literal",
      },
    ],
  },
} as const

export const organizationTemplatePackageV1 = {
  conformsTo: [MARKER_CORE_V1_PROFILE, MARKER_SEMANTIC_V1_PROFILE],
  metadata: draftMetadata({
    familyId: "urn:uuid:2f8ee374-43f2-4f56-8995-ca5efde66881",
    versionId: "urn:uuid:f80d7b05-06da-445f-90e2-bfdfa1b285d5",
    title: "Organization",
  }),
  form: migrateLegacyForm(JsonOrganization, JsonOrganizationUI),
  semantics: {
    root: { classIri: "https://schema.org/Organization" },
    bindings: [
      {
        fieldPointer: "/properties/name",
        predicate: "https://schema.org/name",
        valueKind: "literal",
      },
      {
        fieldPointer: "/properties/identifier",
        predicate: "https://schema.org/identifier",
        valueKind: "literal",
      },
      {
        fieldPointer: "/properties/url",
        predicate: "https://schema.org/url",
        valueKind: "iri",
      },
    ],
  },
} as const

export const remainingDefaultTemplatePackagesV1 = [
  funderTemplatePackageV1,
  projectTemplatePackageV1,
  dataTemplatePackageV1,
  documentTemplatePackageV1,
  organizationTemplatePackageV1,
] as const
