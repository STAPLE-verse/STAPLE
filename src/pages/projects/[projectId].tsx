import { Suspense, useState } from "react"
import Head from "next/head"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import getProject from "src/projects/queries/getProject"
import ProjectDashboard from "src/projects/components/ProjectDashboard"
import Modal from "src/core/components/Modal"
import createAnnouncement from "src/messages/mutations/createAnnouncement"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { useCurrentContributor } from "src/contributors/hooks/useCurrentContributor"
import { ContributorPrivileges } from "db"

export const ShowProjectPage = () => {
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })
  const sidebarItems = ProjectSidebarItems(projectId!, "Dashboard")
  const [announcementText, setAnnouncementText] = useState("")
  const { contributor: currentContributor } = useCurrentContributor(projectId)
  const [openModal, setOpenModal] = useState(false)

  const handleToggle = () => {
    setOpenModal((prev) => !prev)
  }

  const [createAnnouncementMutation] = useMutation(createAnnouncement)

  const handleSubmit = async () => {
    // Call the mutation with the announcement text
    await createAnnouncementMutation({ projectId: projectId!, announcementText: announcementText })
    // Clear the textarea
    setAnnouncementText("")
    // Close the modal
    setOpenModal(false)
  }

  return (
    <Layout
      sidebarItems={sidebarItems}
      sidebarTitle={project.name}
      sidebarPrivilege={currentContributor?.privilege}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <Head>
          <title>Project {project.name}</title>
        </Head>

        <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
          {currentContributor!.privilege == ContributorPrivileges.PROJECT_MANAGER && (
            <>
              <button type="button" className="btn" onClick={handleToggle}>
                Send Announcement
              </button>
              <Modal open={openModal} size="w-11/12 max-w-3xl">
                <div className="modal-action">
                  {/* Modal content */}
                  <textarea
                    id="announcement"
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    placeholder="Enter your announcement here"
                  ></textarea>
                  {/* Submit button */}
                  <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                    Submit
                  </button>

                  {/* Closes the modal */}
                  <button type="button" className="btn btn-primary" onClick={handleToggle}>
                    Close
                  </button>
                </div>
              </Modal>
            </>
          )}
          <ProjectDashboard />
        </main>
      </Suspense>
    </Layout>
  )
}

ShowProjectPage.authenticate = true

export default ShowProjectPage
