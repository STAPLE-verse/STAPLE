export const MetadataDisplay = ({ metadata }) => {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return <p>No metadata available for this project.</p>
  }

  const toProperCase = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  const renderValue = (value: any) => {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      // Handle nested objects
      return (
        <div className="ml-4">
          {Object.entries(value).map(([nestedKey, nestedValue]) => (
            <span key={nestedKey}>
              {toProperCase(nestedKey)}: {renderValue(nestedValue)}
              <br />
            </span>
          ))}
        </div>
      )
    } else if (Array.isArray(value)) {
      // Handle arrays
      return (
        <ul className="list-disc ml-6">
          {value.map((item, index) => (
            <li key={index}>{renderValue(item)}</li>
          ))}
        </ul>
      )
    } else {
      // Handle primitive values
      return <span>{value?.toString() || "N/A"}</span>
    }
  }

  return (
    <div className="flex flex-col mt-2">
      <strong>Project Form Data:</strong> <br />
      {Object.entries(metadata)
        .filter(([key]) => key !== "_stapleSchema")
        .map(([key, value]) => (
          <span key={key}>
            {toProperCase(key)}: {renderValue(value)}
            <br />
          </span>
        ))}
    </div>
  )
}
