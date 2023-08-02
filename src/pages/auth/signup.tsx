import { useRouter } from "next/router"
import Head from "next/head"
import { SignupForm } from "src/auth/components/SignupForm"
import { BlitzPage, Routes } from "@blitzjs/next"

const SignupPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>{"Sign Up"}</title>
      </Head>
      <main className="flex flex-col h-screen">
        <SignupForm onSuccess={() => router.push(Routes.Home())} />
      </main>
    </>
  )
}

export default SignupPage
