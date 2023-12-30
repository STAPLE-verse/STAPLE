import { useRouter } from "next/router"
import Head from "next/head"
import { SignupForm } from "src/auth/components/SignupForm"
import { BlitzPage, Routes } from "@blitzjs/next"
import TosForm from "src/auth/components/TosForm"
import { useEffect, useState } from "react"
import { useMutation } from "@blitzjs/rpc"
import signup from "src/auth/mutations/signup"

type TosResponses = {
  tos: boolean
}

const SignupPage: BlitzPage = () => {
  const router = useRouter()
  const [signupMutation] = useMutation(signup)
  const [signupSuccess, setSignupSuccess] = useState(false)
  const [signupResponses, setSignupResponses] = useState({ email: "", password: "", username: "" })
  const [tosResponses, setTosResponses] = useState<TosResponses | null>(null)

  const handleSignupSuccess = (values) => {
    setSignupSuccess(true)
    setSignupResponses(values)
  }

  const handleTosSuccess = (values) => {
    setTosResponses(values)
  }

  useEffect(() => {
    // TODO: Ask Chris: is it a problem that if I do not reroute the useEffect stays active and recalls the mutation multiple times which leads to bad request?
    if (tosResponses?.tos && signupSuccess) {
      signupMutation(signupResponses)
        .then((success) => {
          if (success) {
            router.push(Routes.Home()).catch((error) => console.log(error))
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }, [signupResponses, signupSuccess, tosResponses])

  const handleGoBack = () => {
    setSignupSuccess(false)
  }

  return (
    <>
      <Head>
        <title>{"Sign Up"}</title>
      </Head>
      <main className="flex flex-col h-screen">
        {signupSuccess ? (
          <TosForm onSuccess={handleTosSuccess} onCancel={handleGoBack} />
        ) : (
          <SignupForm onSuccess={handleSignupSuccess} signupResponses={signupResponses} />
        )}
      </main>
    </>
  )
}

export default SignupPage
