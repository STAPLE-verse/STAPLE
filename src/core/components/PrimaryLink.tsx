import Link from "next/link"
import { Route } from "next"

interface PrimaryLinkArgs {
  route: Route
  text: string
}

export default function PrimaryLink({ route, text }: PrimaryLinkArgs) {
  return (
    <Link className="btn btn-primary self-end m-4" href={route}>
      {text}
    </Link>
  )
}
