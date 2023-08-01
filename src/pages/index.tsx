import { Suspense } from "react"
import Link from "next/link"
import { Routes, BlitzPage } from "@blitzjs/next"
// import styles from "src/styles/Home.module.css"
import Head from "next/head"

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const UserInfo = () => {
  return (
    <>
      <Link href={Routes.SignupPage()} className="btn">
        <strong>Sign Up</strong>
      </Link>
      <Link href={Routes.LoginPage()} className="btn">
        <strong>Login</strong>
      </Link>
    </>
  )
}

const Home: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>{"Home"}</title>
      </Head>

      <main className="flex flex-col h-screen">
        <div className="flex flex-col justify-center gap-8 text-center flex-grow">
          <h1>STAPLE: Science Tracking Across the Project Lifespan</h1>

          {/* Auth */}
          <div className="flex flex-row gap-8 justify-center">
            <Suspense fallback="Loading...">
              <UserInfo />
            </Suspense>
          </div>
        </div>
        {/* <div className={styles.body}></div> */}
        {/* <footer className={styles.footer}></footer> */}
      </main>
    </>
  )
}

export default Home
