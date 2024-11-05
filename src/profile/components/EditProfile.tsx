import { useRouter } from "next/router"
import React, { Suspense } from "react"
import Head from "next/head"
import getCurrentUser from "src/users/queries/getCurrentUser"
import { useQuery, useMutation } from "@blitzjs/rpc"
import deleteUser from "src/users/mutations/deleteUser"
import { FORM_ERROR } from "final-form"
import updateUser from "src/users/mutations/updateUser"
import { FormProfileSchema } from "src/users/schemas"
import { Routes } from "@blitzjs/next"
import logout from "src/auth/mutations/logout"
import { getDateLocale } from "src/core/utils/getDateLanguageLocales"
import { ProfileForm } from "./ProfileForm"
import { createEditProfileMsg } from "integrations/emails"

export const EditProfile = () => {
  const router = useRouter()

  const [user, { setQueryData }] = useQuery(getCurrentUser, undefined, {
    // This ensures the query never refreshes and overwrites the form data while the user is editing.
    staleTime: Infinity,
  })

  const [logoutMutation] = useMutation(logout)
  const [updateUserMutation] = useMutation(updateUser)
  const [deleteUserMutation] = useMutation(deleteUser)

  const initialLanguageOption = getDateLocale(user!.language) || { name: "", id: "" }

  const initialValues = {
    firstName: user!.firstName,
    lastName: user!.lastName,
    email: user!.email,
    institution: user!.institution,
    username: user!.username,
    language: initialLanguageOption["id"] as string,
  }

  return (
    <>
      <Head>
        <title>Edit Profile</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="text-3xl flex mb-2">Edit Profile</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <ProfileForm
            submitText="Update Profile"
            schema={FormProfileSchema}
            initialValues={initialValues}
            cancelText="Cancel"
            onCancel={() => router.push(Routes.ProfilePage())}
            onSubmit={async (values) => {
              try {
                const updated = await updateUserMutation({
                  ...values,
                })
                await setQueryData(updated)

                const response = await fetch("/api/send-email", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(createEditProfileMsg(user)),
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

          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="btn btn-warning"
              onClick={async () => {
                if (
                  window.confirm("The user will be permanently deleted. Are you sure to continue?")
                ) {
                  await deleteUserMutation()
                  await logoutMutation()
                  await router.push(Routes.Home())
                }
              }}
            >
              Delete user
            </button>
          </div>
        </Suspense>
      </main>
    </>
  )
}
