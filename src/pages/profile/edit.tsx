import React, { Suspense } from "react"
import Layout from "src/core/layouts/Layout"
import { EditProfile } from "src/profile/components/EditProfile"

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
  // @ts-expect-error children are clearly passed below
  return <Layout title="Edit Profile">{page}</Layout>
}

export default EditProfilePage
