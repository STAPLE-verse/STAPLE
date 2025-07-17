import { useRouter } from "next/router"
import Head from "next/head"
import { SignupForm } from "src/auth/components/SignupForm"
import { BlitzPage, Routes } from "@blitzjs/next"
import TosForm from "src/auth/components/TosForm"
import { useEffect, useState } from "react"
import { useMutation } from "@blitzjs/rpc"
import signup from "src/auth/mutations/signup"
import toast from "react-hot-toast"

type TosResponses = {
  tos: boolean
}

const SignupPage: BlitzPage = () => {
  const router = useRouter()
  const [signupMutation] = useMutation(signup)
  const [signupSuccess, setSignupSuccess] = useState(false)
  const [signupResponses, setSignupResponses] = useState({
    email: "",
    password: "",
    username: "",
    password_confirm: "",
  })
  const [tosResponses, setTosResponses] = useState<TosResponses | null>(null)

  const handleSignupSuccess = (values) => {
    setSignupSuccess(true)
    setSignupResponses(values)
  }

  const handleTosSuccess = (values) => {
    setTosResponses(values)
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (tosResponses?.tos && signupSuccess) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      signupMutation(signupResponses)
        // eslint-disable-next-line react-hooks/exhaustive-deps
        .then((success) => {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          if (success) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            router.push(Routes.Thanks()).catch((e) => toast.error(e.message))
          }
        })
        .catch((error) => {
          toast.error(`Signup failed: ${error.message}`)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signupResponses, signupSuccess, tosResponses])

  const handleGoBack = () => {
    setSignupSuccess(false)
  }

  return (
    <>
      {/* @ts-expect-error false positive: JSX children are valid here */}
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
