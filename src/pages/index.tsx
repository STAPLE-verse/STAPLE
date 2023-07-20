import { Suspense } from "react"
import Link from "next/link"
import { Routes, BlitzPage } from "@blitzjs/next"
import styles from "src/styles/Home.module.css"
import Head from "next/head"

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const UserInfo = () => {
  return (
    <>
      <Link href={Routes.SignupPage()} className={styles.button}>
        <strong>Sign Up</strong>
      </Link>
      <Link href={Routes.LoginPage()} className={styles.loginButton}>
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

      <div className={styles.globe} />

      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.wrapper}>
            <div className={styles.header}>
              <h1>STAPLE: Science Tracking Across the Project Lifespan</h1>

              {/* Auth */}

              <div className={styles.buttonContainer}>
                <Suspense fallback="Loading...">
                  <UserInfo />
                </Suspense>
              </div>
            </div>

            {/* <div className={styles.body}></div> */}
          </div>
        </main>

        {/* <footer className={styles.footer}></footer> */}
      </div>
    </>
  )
}

export default Home
