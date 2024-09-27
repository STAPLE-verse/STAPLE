import Link from "next/link"
import { Route } from "next"
import { RouteUrlObject } from "blitz"

interface PrimaryLinkArgs {
  route: Route | RouteUrlObject
  text: string
}

export default function PrimaryLink({ route, text }: PrimaryLinkArgs) {
  return (
    <Link className="btn btn-primary self-end" href={route}>
      {text}
    </Link>
  )
}
