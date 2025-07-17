import { Routes, BlitzPage } from "@blitzjs/next"
import { useRouter } from "next/router"
import { useEffect } from "react"
import Head from "next/head"

const Home: BlitzPage = () => {
  const router = useRouter()

  useEffect(() => {
    void router.push(Routes.LoginPage())
  }, [router])

  return (
    <>
      {/* @ts-expect-error false positive: JSX children are valid here */}
      <Head>
        <title>{"Home"}</title>
      </Head>
    </>
  )
}

export default Home
