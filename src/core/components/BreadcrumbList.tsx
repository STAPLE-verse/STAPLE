import Link from "next/link"
import { BreadcrumbItem } from "../types"
import { useTranslation } from "react-i18next"

export const BreadcrumbList = ({ items }: { items: BreadcrumbItem[] }) => {
  const { t } = (useTranslation as any)()

  return (
    <ul>
      <li>
        <Link href="/main" className="hover:underline">
          {t("breadcrumbs.home")}
        </Link>
      </li>
      {items.map((crumb, index) => (
        <li key={index}>
          {crumb.isLast ? (
            <span className="font-bold text-base-content">{crumb.label}</span>
          ) : crumb.isValid ? (
            <Link href={crumb.href} className="hover:underline">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-base-content">{crumb.label}</span>
          )}
        </li>
      ))}
    </ul>
  )
}
