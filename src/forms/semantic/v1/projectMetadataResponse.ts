import {
  projectSemanticV1,
  type ConformanceDiagnostic,
} from "@staple-verse/marker-template-runtime"
import { mapStapleToJsonLd } from "src/forms/utils/mapStapleToJsonLd"

export type MetadataProjectionMode = "semantic-v1" | "legacy-staple"

export interface MetadataProjectionResult {
  mode: MetadataProjectionMode
  jsonLd: unknown | null
  diagnostics: ConformanceDiagnostic[]
}

interface FormVersionProjectionSource {
  schema: unknown
  semantics?: unknown | null
}

/**
 * Semantic V1 is opt-in per exact STAPLE FormVersion. A declared semantic
 * component is never silently replaced by the legacy name-based mapper when
 * validation or projection fails.
 */
export function projectMetadataResponse(
  metadata: Record<string, unknown>,
  formVersion?: FormVersionProjectionSource | null,
  options?: { rootInstanceIri?: string; startDate?: string; endDate?: string }
): MetadataProjectionResult {
  if (formVersion?.semantics) {
    const result = projectSemanticV1(
      {
        form: { schema: formVersion.schema },
        semantics: formVersion.semantics,
      },
      metadata,
      { rootInstanceIri: options?.rootInstanceIri }
    )

    return {
      mode: "semantic-v1",
      jsonLd: result.expandedJsonLd,
      diagnostics: result.diagnostics,
    }
  }

  return {
    mode: "legacy-staple",
    jsonLd: mapStapleToJsonLd(metadata, {
      startDate: options?.startDate,
      endDate: options?.endDate,
    }),
    diagnostics: [],
  }
}
