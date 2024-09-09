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
      <div className="flex flex-col w-full">
        <div className="flex justify-center items-center mb-4">
          <Link href={Routes.SignupPage()} className="btn btn-primary mr-4">
            <strong>Sign Up</strong>
          </Link>
          <Link href={Routes.LoginPage()} className="btn btn-secondary">
            <strong>Log In</strong>
          </Link>
        </div>

        <div className="flex justify-center mt-2">
          <div className="card bg-base-300 w-1/2">
            <div className="card-body">
              <div className="card-title">Version Information</div>
              Please note: This app is currently in active development, and you may encounter bugs
              or issues as we continue to improve the platform.
              <p>
                We&apos;re working hard to make STAPLE better every day, and we really appreciate
                your patience and support! If you run into any problems or have any feedback, please
                don&apos;t hesitate to report it. Your input helps us fix issues quickly and improve
                the experience for everyone.
              </p>
              <p>
                You can report bugs or provide feedback via{" "}
                <a
                  href="mailto:staple.helpdesk@gmail.com"
                  className="text-bold text-underline text-primary"
                >
                  our ticketing system
                </a>
                . We&apos;re committed to resolving them as soon as possible. Thank you for helping
                us make STAPLE great!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const Home: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>{"Home"}</title>
      </Head>

      <main className="flex h-screen">
        <div className="flex flex-col items-center flex-grow justify-center">
          <picture>
            <source
              srcSet="/logo_white_big.png"
              media="(prefers-color-scheme: dark)"
              //alt="STAPLE Logo"
              width={200}
            />
            <img src="/logo_black_big.png" alt="STAPLE Logo" width={200} />
          </picture>

          <h1 className="text-4xl pb-8 mt-4">
            STAPLE: Science Tracking Across the Project Lifespan
          </h1>

          {/* Auth */}
          <div className="flex flex-row gap-8">
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
