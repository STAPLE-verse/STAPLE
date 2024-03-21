import { BlitzPage } from "@blitzjs/next"
import { LoginForm } from "src/auth/components/LoginForm"
import { useRouter } from "next/router"
import Head from "next/head"

const LoginPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>{"Login"}</title>
      </Head>
      <main className="flex flex-col h-screen">
        <LoginForm
          onSuccess={(_user) => {
            const next = router.query.next
              ? decodeURIComponent(router.query.next as string)
              : "/projects"
            return router.push(next)
          }}
        />
      </main>
    </>
  )
}

export default LoginPage
