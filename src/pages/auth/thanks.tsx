import { BlitzPage } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { Routes } from "@blitzjs/next"

export const Thanks: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>{"Thanks for Signing Up"}</title>
      </Head>

      <main className="flex h-screen">
        <div className="flex flex-col max-w-3xl mx-auto w-full mt-2">
          <div className="flex justify-center items-center w-full">
            <picture>
              <source
                srcSet="/logo_white_big.png"
                media="(prefers-color-scheme: dark)"
                //alt="STAPLE Logo"
                width={200}
              />
              <img src="/logo_black_big.png" alt="STAPLE Logo" width={200} />
            </picture>
          </div>

          <h1 className="text-center text-3xl mt-2">Welcome to STAPLE!</h1>

          <div className="flex flex-row mt-4">
            You will receive an email confirming that you signed up for an account. You may now
            login using the email and password you signed up with. You can change your email,
            username, and password within the settings of STAPLE.
          </div>
          <div className="flex flex-row justify-end mb-4">
            <Link className="btn btn-primary" href={Routes.Home()}>
              Go Home
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

export default Thanks
