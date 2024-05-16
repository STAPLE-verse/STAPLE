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
          <h3>{project.name}</h3>
          <div className="flex flex-col gap-4">
            <p className="">{project.description}</p>
            <p className="italic">
              Last update:{" "}
              {project.updatedAt.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false, // Use 24-hour format
              })}
            </p>
          </div>
          <div className="divider mt-4 mb-4">Project Dashboard</div>
          <button type="button" className="btn" onClick={handleToggle}>
            Create announcement
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
          <ProjectDashboard />
        </main>
      </Suspense>
    </Layout>
  )
}

ShowProjectPage.authenticate = true

export default ShowProjectPage
