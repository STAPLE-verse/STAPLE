import { useRouter } from "next/router"
import React, { Suspense } from "react"
import Layout from "src/core/layouts/Layout"
import Head from "next/head"
import getCurrentUser from "src/users/queries/getCurrentUser"
import { useQuery, useMutation } from "@blitzjs/rpc"
import deleteUser from "src/users/mutations/deleteUser"
import { Form, FormProps } from "src/core/components/fields/Form"
import { FORM_ERROR } from "final-form"
import { LabeledTextField } from "src/core/components/fields/LabeledTextField"
import updateUser from "src/users/mutations/updateUser"
import { z } from "zod"
import { FormProfileSchema } from "src/users/schemas"
import { Routes } from "@blitzjs/next"
import logout from "src/auth/mutations/logout"
import Link from "next/link"

export function ProfileForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField
        name="email"
        label="Email:"
        placeholder="Email"
        type="text"
        className="mb-4 text-primary border-primary border-2 bg-base-300"
      />
      <br />
      <LabeledTextField
        name="username"
        label="Username:"
        placeholder="Username"
        type="text"
        className="mb-4 text-primary border-primary border-2 bg-base-300"
      />
      <br />
      <LabeledTextField
        name="firstName"
        label="First Name:"
        placeholder="First name"
        type="text"
        className="mb-4 text-primary border-primary border-2 bg-base-300"
      />
      <br />
      <LabeledTextField
        name="lastName"
        label="Last Name:"
        placeholder="Last name"
        type="text"
        className="mb-4 text-primary border-primary border-2 bg-base-300"
      />
      <br />
      <LabeledTextField
        name="institution"
        label="Institution:"
        placeholder="Institution"
        type="text"
        className="mb-4 text-primary border-primary border-2 bg-base-300"
      />
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
      {/* labeled select field for language */}
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
    institution: user!.institution,
    username: user!.username,
  }

  return (
    <>
      <Head>
        <title>Edit profile</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="text-3xl flex mb-2">Edit profile</h1>
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

          <div className="flex justify-end mt-4">
            <Link href="/api/auth/orcid" legacyBehavior>
              <button className="btn btn-info mr-2">Connect your ORCID</button>
            </Link>

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
EditProfilePage.getLayout = (page) => {
  return <Layout>{page}</Layout>
}

export default EditProfilePage
