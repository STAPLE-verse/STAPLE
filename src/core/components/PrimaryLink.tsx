import Link from "next/link"
import { Route } from "next"
import { RouteUrlObject } from "blitz"

interface PrimaryLinkArgs {
  route: Route | RouteUrlObject
  text: string | JSX.Element
  classNames: string
}

export default function PrimaryLink({ route, text, classNames }: PrimaryLinkArgs) {
  return (
    <Link className={`btn self-end ${classNames}`} href={route}>
      {text}
    </Link>
  )
}
