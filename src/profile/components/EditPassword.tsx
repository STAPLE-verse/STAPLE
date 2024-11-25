import { useRouter } from "next/router"
import React, { Suspense } from "react"
import Head from "next/head"
import { useMutation } from "@blitzjs/rpc"
import { FORM_ERROR } from "final-form"
import changePassword from "src/auth/mutations/changePassword"
import { ChangePassword } from "src/auth/schemas"
import { Routes } from "@blitzjs/next"
import { PasswordForm } from "./PasswordForm"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { createEditPasswordMsg } from "integrations/emails"

export const EditPassword = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()

  const [changePasswordMutation] = useMutation(changePassword)

  return (
    <>
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

                const response = await fetch("/api/send-email", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(createEditPasswordMsg(currentUser)),
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
