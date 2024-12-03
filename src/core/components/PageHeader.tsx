import React from "react"

interface PageHeaderProps {
  title: string
  className?: string
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, className = "" }) => (
  <h1 className={`text-3xl ${className}`}>{title}</h1>
)

export default PageHeader
