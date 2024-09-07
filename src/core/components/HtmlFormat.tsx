interface HtmlFormatProps {
  html?: string | null
}

export default function HtmlFormat({ html }: HtmlFormatProps) {
  return <span> {html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : ""}</span>
}
