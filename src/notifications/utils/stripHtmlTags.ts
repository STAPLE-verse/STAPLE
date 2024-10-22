export const stripHtmlTags = (htmlString: string) => {
  const doc = new DOMParser().parseFromString(htmlString, "text/html")
  return doc.body.textContent || ""
}
