export const MARKER_CORE_V1_PROFILE = "https://staplescience.com/profiles/marker-template/core/v1"
export const MARKER_SEMANTIC_V1_PROFILE =
  "https://staplescience.com/profiles/marker-template/semantic/v1"

/**
 * The first STAPLE built-in migrated to the portable MARKER template contract.
 * It intentionally remains a draft package until ownership, publisher, and
 * publication metadata are decided in MARKER.
 */
export const projectMemberTemplatePackageV1 = {
  conformsTo: [MARKER_CORE_V1_PROFILE, MARKER_SEMANTIC_V1_PROFILE],
  metadata: {
    familyId: "urn:uuid:08c582dc-f374-4d41-8b1f-22ab0eadc6bc",
    versionId: "urn:uuid:3354388d-0819-4a0d-9b33-7952f9e76031",
    version: "draft-1",
    status: "draft",
    resourceType: "MetadataTemplate",
    title: "Contributor Information",
    createdAt: "2026-08-24T00:00:00Z",
    updatedAt: "2026-08-24T00:00:00Z",
  },
  form: {
    schema: {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "object",
      title: "Contributor Information",
      description:
        "Please enter your information to document your contributions. This information will be used to share who contributed to a project.",
      required: ["givenName", "familyName", "email", "identifier"],
      properties: {
        email: {
          type: "string",
          title: "Email:",
          format: "email",
          description:
            "Email to be used for official publications, this email can be different than your profile contact email.",
        },
        givenName: {
          type: "string",
          title: "First Name:",
        },
        familyName: {
          type: "string",
          title: "Family or Last Name:",
        },
        identifier: {
          type: "string",
          format: "uri",
          title: "ORCID:",
          default: "https://orcid.org/0000-0000-0000-0000",
          description:
            "Enter the complete ORCID URL. You can get an ORCID for free from https://orcid.org/.",
        },
        additionalName: {
          type: "string",
          title: "Middle Name or Initial:",
        },
      },
      dependencies: {},
    },
    uiSchema: {
      "ui:order": ["givenName", "additionalName", "familyName", "email", "identifier"],
    },
  },
  semantics: {
    root: {
      classIri: "https://schema.org/Person",
    },
    bindings: [
      {
        fieldPointer: "/properties/givenName",
        predicate: "https://schema.org/givenName",
        valueKind: "literal",
      },
      {
        fieldPointer: "/properties/additionalName",
        predicate: "https://schema.org/additionalName",
        valueKind: "literal",
      },
      {
        fieldPointer: "/properties/familyName",
        predicate: "https://schema.org/familyName",
        valueKind: "literal",
      },
      {
        fieldPointer: "/properties/email",
        predicate: "https://schema.org/email",
        valueKind: "literal",
      },
      {
        fieldPointer: "/properties/identifier",
        predicate: "https://schema.org/identifier",
        valueKind: "iri",
      },
    ],
  },
} as const

export type ProjectMemberTemplatePackageV1 = typeof projectMemberTemplatePackageV1
