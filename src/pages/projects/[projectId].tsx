import { Suspense, useState } from "react"
import Head from "next/head"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import getProject from "src/projects/queries/getProject"
import ProjectDashboard from "src/projects/components/ProjectDashboard"
import { ProjectSidebarItems } from "src/core/layouts/SidebarItems"
import Modal from "src/core/components/Modal"
import createAnnouncement from "src/messages/mutations/createAnnouncement"

export const ShowProjectPage = () => {
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })
  const sidebarItems = ProjectSidebarItems(projectId!, "Dashboard")
  const [announcementText, setAnnouncementText] = useState("")

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
    <Layout sidebarItems={sidebarItems} sidebarTitle={project.name}>
      <Suspense fallback={<div>Loading...</div>}>
        <Head>
          <title>Project {project.name}</title>
        </Head>

        <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
          <button type="button" className="btn" onClick={handleToggle}>
            Send Announcement
          </button>
          <Modal open={openModal} size="w-11/12 max-w-3xl">
            <div className="modal-action flex flex-col">
              {/* Modal content */}
              <textarea
                className="text-base py-1 px-2 rounded appearance-none"
                id="announcement"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="Enter your announcement here"
              ></textarea>
              <div className="flex justify-end space-x-2 mt-2">
                {/* Submit button */}
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                  Submit
                </button>

                {/* Closes the modal */}
                <button type="button" className="btn btn-primary" onClick={handleToggle}>
                  Close
                </button>
              </div>
            </div>
          </Modal>
          <ProjectDashboard />
        </main>
      </Suspense>
    </Layout>
  )
}

ShowProjectPage.authenticate = true

export default ShowProjectPage
