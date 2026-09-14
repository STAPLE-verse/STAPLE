# Default templates: legacy to Semantic V1

This note records intentional differences between STAPLE's legacy JSON-LD
converter and the Semantic V1 bindings attached to newly created built-in form
versions.

Existing forms are not migrated in place. Responses from form versions with a
`semantics` component use Semantic V1; older responses containing
`_stapleSchema` continue through the legacy converter. Raw response JSON is
unchanged. A field described below as **raw-only** remains in that JSON but is
not included in Semantic V1 JSON-LD.

## General differences

- Template semantics move from the hidden `_stapleSchema` response field to
  the exact `FormVersion`.
- Semantic V1 uses explicit field pointers and full IRIs instead of inferring
  meaning from field names.
- Semantic V1 emits deterministic expanded JSON-LD; the legacy converter emits
  compact JSON-LD using a remote `@context`.
- Only explicitly bound fields are projected. Legacy code copied many unknown
  fields directly into JSON-LD.
- Semantic V1 distinguishes typed literals from resource IRIs.

## Contributor Information

- Names and email retain their Schema.org predicates.
- ORCID changes from a string literal to an identified resource using `@id`.
- No fields are intentionally left raw-only.

## Funding for Contributor or Project

- The root remains `schema:FundingAgency`.
- `funder` now maps to `schema:name`; legacy output used `schema:funder`, which
  incorrectly described a funder of the agency rather than the agency's name.
- `identifier`, `awardTitle`, and `description` map to `schema:identifier`,
  `schema:award`, and `schema:description`.
- A future structured funding form may instead model a `schema:Grant` with a
  related funder organization.

## Project Information

- `name`, `abstract`, `keywords`, and `identifier` map to `schema:name`,
  `schema:description`, `schema:keywords`, and `schema:identifier`.
- `citation`, `publisher`, and `license` are raw-only. The legacy converter put
  publisher and license in a `CreativeWork` under `subjectOf` and could replace
  the citation while assembling that value. The current flat fields do not
  establish which project-related creative work they describe.

## Research Data

- `title` maps to `schema:name`.
- `dataType` changes from `schema:encodingFormat` to `schema:additionalType`.
- `format` changes from the superseded `schema:fileFormat` to
  `schema:encodingFormat`.
- `conformsTo` changes from `schema:schemaVersion` to `schema:conformsTo`.
- Description, identifier, creation date, language, version, and free-access
  status retain direct Schema.org mappings.
- Creator, license, size, file list, codebook link, source dataset, and
  conditional media details are raw-only. Accurate export requires structured
  agents, validated identifiers, `DataDownload` nodes, or stable bindings for
  conditional fields. The legacy converter also conflated sample rate with
  bitrate and could overwrite codebook information with the file list.

## Project Document

- Category, title, creation date, identifier, description, language, and file
  format map to `schema:genre`, `schema:name`, `schema:dateCreated`,
  `schema:identifier`, `schema:description`, `schema:inLanguage`, and
  `schema:encodingFormat`.
- `type` is raw-only because values such as "analysis code" describe document
  kind or purpose, not necessarily `schema:about` as assumed by the legacy
  converter.
- Creator, license, and conditional media details are raw-only until the form
  captures the structures and value formats their RDF relationships require.

## Organization

- Name and identifier retain direct Schema.org mappings.
- Website URL is explicitly projected as an IRI.
- City and country are raw-only. Semantic V1 does not synthesize a
  `schema:PostalAddress` node from sibling scalar fields; the form must first
  represent address as a structured object.

## Design rule

Partial semantic annotation is intentional. STAPLE preserves every collected
value in raw JSON, while Semantic V1 exports only claims supported by the form's
structure and explicit bindings. Future template versions can add structured
fields and richer bindings without changing the meaning of historical form
versions.

References: [Schema.org ResearchProject](https://schema.org/ResearchProject),
[FundingAgency](https://schema.org/FundingAgency),
[Dataset](https://schema.org/Dataset), and
[MediaObject](https://schema.org/MediaObject).
