import Link from "next/link"
import { BreadcrumbItem } from "../types"

export const BreadcrumbList = ({ items }: { items: BreadcrumbItem[] }) => (
  <ul>
    <li>
      <Link href="/main" className="hover:underline">
        Home
      </Link>
    </li>
    {items.map((crumb, index) => (
      <li key={index}>
        {crumb.isLast ? (
          <span className="font-bold text-base-content">{crumb.label}</span>
        ) : (
          <Link href={crumb.href} className="hover:underline">
            {crumb.label}
          </Link>
        )}
      </li>
    ))}
  </ul>
)
