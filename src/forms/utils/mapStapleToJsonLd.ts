export function mapStapleToJsonLd(
  metadata: Record<string, any>,
  options?: { startDate?: string; endDate?: string }
) {
  const schemaVersion = metadata._stapleSchema || "unknown"
  const baseContext = "https://schema.org"
  const type = determineSchemaType(schemaVersion)

  const jsonLd: Record<string, any> = {
    "@context": baseContext,
    "@type": type,
  }

  const isPartOf: Record<string, any> = {}

  for (const [key, value] of Object.entries(metadata)) {
    if (key === "_stapleSchema") continue
    if (key === "characterEncoding") continue

    if (type === "MediaObject") {
      if (key === "type") {
        jsonLd["about"] = value
        continue
      }
      if (key === "title") {
        jsonLd["name"] = value
        continue
      }
      if (key === "language") {
        jsonLd["inLanguage"] = value
        continue
      }
      if (key === "documentCategory") {
        jsonLd["genre"] = value
        continue
      }
      if (key === "characterEncoding") {
        jsonLd["encodingFormat"] = value
        continue
      }
    }

    if (type === "ResearchProject") {
      if (key === "abstract") {
        jsonLd["description"] = value
        continue
      }
      if (key === "citation") {
        jsonLd["subjectOf"] = value
        continue
      }
      if (key === "license" || key === "publisher") {
        isPartOf[key] = value
        continue
      }
    }

    if (type === "Organization") {
      if (key === "city" || key === "country") {
        if (!jsonLd["address"]) {
          jsonLd["address"] = {}
        }
        if (key === "city") {
          jsonLd["address"]["addressLocality"] = value
        } else if (key === "country") {
          jsonLd["address"]["addressCountry"] = value
        }
        continue
      }
    }

    if (type === "FundingAgency") {
      if (key === "awardTitle") {
        jsonLd["award"] = value
        continue
      }
    }

    if (type === "Dataset") {
      if (key === "width" || key === "height") {
        continue // avoid putting width and height at root
      }
      if (key === "bitRate") continue
      if (key === "title") {
        jsonLd["name"] = value
        continue
      }
      if (key === "dataType") {
        jsonLd["encodingFormat"] = value
        continue
      }
      if (key === "format") {
        jsonLd["fileFormat"] = value
        continue
      }
      if (key === "language") {
        jsonLd["inLanguage"] = value
        continue
      }
      if (key === "conformsTo") {
        jsonLd["schemaVersion"] = value
        continue
      }
      if (key === "codebookLink") {
        jsonLd["includedInDataCatalog"] = {
          "@type": "DataCatalog",
          name: "Codebook",
          url: value,
        }
        continue
      }
      if (key === "fileList") {
        jsonLd["includedInDataCatalog"] = {
          "@type": "DataCatalog",
          dataset: (value || []).map((item: string) => ({
            "@type": "DataDownload",
            contentUrl: item,
          })),
        }
        continue
      }
      if (key === "numberOfFiles") {
        continue // exclude from download
      }
    }

    if (type === "Dataset") {
      if (key === "duration" || key === "sampleRate") continue
    }

    jsonLd[key] = value
  }

  if (type === "Dataset") {
    if (metadata.dataType === "Text" && metadata.characterEncoding) {
      jsonLd.encodingFormat = metadata.characterEncoding
    }
  }

  if (type === "Dataset") {
    if (
      metadata.dataType === "Video" ||
      metadata.dataType === "Image" ||
      metadata.width ||
      metadata.height ||
      metadata.bitRate
    ) {
      const mediaType =
        metadata.dataType === "Video"
          ? "VideoObject"
          : metadata.dataType === "Image"
          ? "ImageObject"
          : "MediaObject"

      jsonLd["hasPart"] = [
        {
          "@type": mediaType,
          ...(metadata.width && { width: metadata.width }),
          ...(metadata.height && { height: metadata.height }),
          ...(metadata.dataType === "Video" && metadata.bitRate && { bitrate: metadata.bitRate }),
        },
      ]
    }

    if (metadata.dataType === "Audio") {
      jsonLd["hasPart"] = [
        {
          "@type": "AudioObject",
          ...(metadata.duration && { duration: metadata.duration }),
          ...(metadata.sampleRate && { bitrate: metadata.sampleRate }), // sampleRate is stored as bitrate
        },
      ]
    }
  }

  const subjectOfArray: any[] = []

  if (Object.keys(isPartOf).length > 0) {
    subjectOfArray.push({
      "@type": "CreativeWork",
      ...isPartOf,
    })
  }

  if (type === "ResearchProject") {
    const event: Record<string, any> = {
      "@type": "Event",
    }
    if (options?.startDate) event["startDate"] = options.startDate
    if (options?.endDate) event["endDate"] = options.endDate

    if (event.startDate || event.endDate) {
      subjectOfArray.push(event)
    }
  }

  if (subjectOfArray.length > 0) {
    jsonLd["subjectOf"] = subjectOfArray
  }

  return jsonLd
}

function determineSchemaType(schemaVersion: string): string {
  if (schemaVersion.startsWith("projectmember")) return "Person"
  if (schemaVersion.startsWith("project")) return "ResearchProject"
  if (schemaVersion.startsWith("data")) return "Dataset"
  if (schemaVersion.startsWith("document")) return "MediaObject"
  if (schemaVersion.startsWith("funder")) return "FundingAgency"
  if (schemaVersion.startsWith("organization")) return "Organization"
  return "Thing"
}
