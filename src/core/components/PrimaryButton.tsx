import Link from "next/link"
import { Route } from "next"

interface PrimaryButtonArgs {
  route: Route
  text: string
}

export default function PrimaryButton({ route, text }: PrimaryButtonArgs) {
  return (
    <Link className="btn btn-primary self-end m-4" href={route}>
      {text}
    </Link>
  )
}
