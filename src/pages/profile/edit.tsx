import { useRouter } from "next/router"
import React, { Suspense } from "react"
import Layout from "src/core/layouts/Layout"
import Head from "next/head"
import getCurrentUser from "src/users/queries/getCurrentUser"
import { useQuery, useMutation, setQueryData } from "@blitzjs/rpc"
import deleteUser from "src/users/mutations/deleteUser"
import { FORM_ERROR, Form, FormProps } from "src/core/components/Form"
import { LabeledTextField } from "src/core/components/LabeledTextField"
import updateUser from "src/users/mutations/updateUser"
import { z } from "zod"
export { FORM_ERROR } from "src/core/components/Form"
import { FormProfileSchema } from "src/users/schemas"
import { Routes } from "@blitzjs/next"
import logout from "src/auth/mutations/logout"

export function ProfileForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField name="email" label="Email" placeholder="Email" type="text" />
      <br />
      <LabeledTextField name="firstName" label="First name" placeholder="First name" type="text" />
      <br />
      <LabeledTextField name="lastName" label="Last name" placeholder="Last name" type="text" />
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
    </Form>
  )
}

export const EditProfile = () => {
  const router = useRouter()

  const [user, { setQueryData }] = useQuery(getCurrentUser, undefined, {
    // This ensures the query never refreshes and overwrites the form data while the user is editing.
    staleTime: Infinity,
  })

  const [logoutMutation] = useMutation(logout)
  const [updateUserMutation] = useMutation(updateUser)
  const [deleteUserMutation] = useMutation(deleteUser)

  const initialValues = {
    firstName: user!.firstName,
    lastName: user!.lastName,
    email: user!.email,
  }

  return (
    <>
      <Head>
        <title>Edit profile</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2">Edit profile</h1>
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
                await router.push(Routes.ProfilePage({}))
              } catch (error: any) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
          />

          <div className="flex justify-end">
            <button
              type="button"
              className="btn"
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

const EditProfilePage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditProfile />
      </Suspense>
    </div>
  )
}

EditProfilePage.authenticate = true
EditProfilePage.getLayout = (page) => <Layout>{page}</Layout>

export default EditProfilePage
