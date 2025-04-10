import Head from "next/head"
import { ErrorComponent } from "@blitzjs/next"

// ------------------------------------------------------
// This page is rendered if a route match is not found
// ------------------------------------------------------
export default function Page404() {
  const statusCode = 404
  const title = "This page could not be found"
  return (
    <>
      {/* @ts-expect-error false positive: JSX children are valid here */}
      <Head>
        <title>
          {statusCode}: {title}
        </title>
      </Head>
      <ErrorComponent statusCode={statusCode} title={title} />
    </>
  )
}
