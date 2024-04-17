export async function getTemplateContent(
  templateId: string,
  type: "email" | "notification"
): Promise<string> {
  try {
    const response = await fetch(`/api/rpc/messages/templates/${type}/${templateId}`)
    if (!response.ok) {
      // If the server responded with a non-200 status, read the response as text to get detailed error message
      const errorText = await response.text()
      throw new Error(`HTTP Error: ${response.status}. Server says: ${errorText}`)
    }
    const data = await response.json()
    return data.content
  } catch (error) {
    console.error("Failed to fetch or parse template content:", error)
    throw new Error(`Failed to load template content: ${error.message}`)
  }
}
