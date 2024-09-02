import { useRouter } from "next/router"
import React, { Suspense } from "react"
import Head from "next/head"
import getCurrentUser from "src/users/queries/getCurrentUser"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { FORM_ERROR } from "final-form"
import changePassword from "src/auth/mutations/changePassword"
import { ChangePassword } from "src/auth/schemas"
import { Routes } from "@blitzjs/next"
import { PasswordForm } from "./PasswordForm"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

export const EditPassword = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()

  const [changePasswordMutation] = useMutation(changePassword)

  return (
    <>
      <Head>
        <title>Edit Password</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="text-3xl flex mb-2">Edit Password</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <PasswordForm
            submitText="Update Password"
            schema={ChangePassword}
            cancelText="Cancel"
            onCancel={() => router.push(Routes.ProfilePage())}
            onSubmit={async (values) => {
              // console.log(values)
              try {
                const updated = await changePasswordMutation({
                  ...values,
                })

                const msg = {
                  from: "staple.helpdesk@gmail.com",
                  to: currentUser!.email,
                  subject: "STAPLE Password Change",
                  html: `
                    <h3>STAPLE Password Change</h3>

                    This email is to notify you that you recently updated your
                    password. If you did not make this change, please
                    contact us immediately.
                    <p>
                    If you need more help, you can reply to this email to create a ticket.
                    <p>
                    Thanks,
                    <br>
                    STAPLE HelpDesk
                  `,
                }

                const response = await fetch("/api/send-email", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(msg),
                })

                if (response.ok) {
                  console.log("Email sent successfully")
                } else {
                  console.error("Failed to send email")
                }

                await router.push(Routes.ProfilePage({}))
              } catch (error: any) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
          />
        </Suspense>
      </main>
    </>
  )
}
