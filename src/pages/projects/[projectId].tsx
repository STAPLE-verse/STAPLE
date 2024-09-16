import { Suspense, useState } from "react"
import Head from "next/head"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import getProject from "src/projects/queries/getProject"
import ProjectDashboard from "src/projects/components/ProjectDashboard"
import Modal from "src/core/components/Modal"
import createAnnouncement from "src/notifications/mutations/createAnnouncement"
import { useCurrentContributor } from "src/projectmembers/hooks/useCurrentContributor"
import { MemberPrivileges } from "db"
import { AnnouncementForm } from "src/projects/components/AnnouncementForm"
import { FormAnnouncementSchema } from "src/projects/schemas"

interface ShowProjectContentProps {
  projectId: number
}

const ShowProjectContent = ({ projectId }: ShowProjectContentProps) => {
  const { contributor: currentContributor } = useCurrentContributor(projectId)
  const [openModal, setOpenModal] = useState(false)

  const handleToggle = () => {
    setOpenModal((prev) => !prev)
  }

  const [createAnnouncementMutation] = useMutation(createAnnouncement)

  const handleSubmit = async (values) => {
    try {
      await createAnnouncementMutation({
        projectId: projectId!,
        announcementText: values.announcementText,
      })
      setOpenModal(false)
    } catch (error) {
      console.error("Error creating announcement:", error)
    }
  }

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      {currentContributor!.privilege == MemberPrivileges.PROJECT_MANAGER && (
        <>
          <button type="button" className="btn btn-primary mb-4" onClick={handleToggle}>
            Create Announcement
          </button>
          <Modal open={openModal} size="w-1/3">
            {/* Modal content */}
            <AnnouncementForm
              submitText="Send Announcement"
              schema={FormAnnouncementSchema}
              cancelText="Cancel"
              onSubmit={handleSubmit}
              onCancel={handleToggle}
            ></AnnouncementForm>
          </Modal>
        </>
      )}
      <ProjectDashboard />
    </main>
  )
}

export const ShowProjectPage = () => {
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <Head>
          <title>Project {project.name}</title>
        </Head>
        <ShowProjectContent projectId={projectId!} />
      </Suspense>
    </Layout>
  )
}

ShowProjectPage.authenticate = true

export default ShowProjectPage
