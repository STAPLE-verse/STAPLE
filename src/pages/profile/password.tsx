import React, { Suspense } from "react"
import Layout from "src/core/layouts/Layout"
import { EditPassword } from "src/profile/components/EditPassword"

const EditPasswordPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditPassword />
      </Suspense>
    </div>
  )
}

EditPasswordPage.authenticate = true
EditPasswordPage.getLayout = (page) => {
  return <Layout title="Edit Password">{page}</Layout>
}

export default EditPasswordPage
