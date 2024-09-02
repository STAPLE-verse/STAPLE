import Link from "next/link"
import { Route } from "next"
import { RouteUrlObject } from "blitz"

interface PrimaryLinkArgs {
  route: Route | RouteUrlObject
  text: string
}

export default function PrimaryLink({ route, text }: PrimaryLinkArgs) {
  return (
    <Link className="btn btn-primary self-end m-4" href={route}>
      {text}
    </Link>
  )
}
