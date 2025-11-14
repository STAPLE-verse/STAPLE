import { Suspense } from "react"
import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import DateFormat from "src/core/components/DateFormat"

const ProfilePage = () => {
  const currentUser = useCurrentUser()
  if (currentUser === null) {
    return <div>Loading...</div>
  } else {
    const fullName = `${currentUser.firstName || ""} ${currentUser.lastName || ""}`

    return (
      <main className="flex flex-col mx-auto w-full">
        <h1 className="text-3xl flex justify-center mb-2">{currentUser.username}&apos;s profile</h1>
        <div className="text-lg">
          <div className="card bg-base-300 w-full">
            <div className="card-body">
              <div className="card-title" data-tooltip-id="milestone-tool">
                Profile Information
              </div>
              <div>
                <span className="font-semibold">Username:</span> {currentUser.username}
              </div>
              <div>
                <span className="font-semibold">Email:</span> {currentUser.email}
              </div>
              <div>
                <span className="font-semibold">Name:</span>{" "}
                {currentUser.firstName && currentUser.lastName ? (
                  fullName
                ) : (
                  <span className="italic">No name provided</span>
                )}
              </div>
              <div>
                <span className="font-semibold">Institution:</span>{" "}
                {currentUser.institution ? (
                  currentUser.institution
                ) : (
                  <span className="italic">No institution provided</span>
                )}
              </div>
              <div>
                <span className="font-semibold">Signup Date:</span>{" "}
                <DateFormat date={currentUser.createdAt} />
              </div>
              <div>
                <span className="font-semibold">Tooltips:</span>{" "}
                {currentUser.tooltips ? (
                  <span className="text-success">On</span>
                ) : (
                  <span className="text-error">Off</span>
                )}
              </div>
              <div>
                <span className="font-semibold">Language:</span>{" "}
                {currentUser.language || <span className="italic">No language selected</span>}
              </div>
              <div>
                <span className="font-semibold">Project Activity Emails:</span>{" "}
                {currentUser.emailProjectActivityFrequency.charAt(0) +
                  currentUser.emailProjectActivityFrequency.slice(1).toLowerCase()}
              </div>
              <div>
                <span className="font-semibold">Overdue Task Emails:</span>{" "}
                {currentUser.emailOverdueTaskFrequency.charAt(0) +
                  currentUser.emailOverdueTaskFrequency.slice(1).toLowerCase()}
              </div>
              <div className="card-actions justify-end">
                <Link className="btn btn-primary" href={Routes.EditProfilePage()}>
                  Edit Profile
                </Link>

                <Link className="btn btn-secondary" href={Routes.EditPasswordPage()}>
                  Edit Password
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
}

ProfilePage.authenticate = true

ProfilePage.getLayout = () => {
  return (
    <Suspense>
      {/* @ts-expect-error children are clearly passed below*/}
      <Layout>
        <ProfilePage />
      </Layout>
    </Suspense>
  )
}

export default ProfilePage
