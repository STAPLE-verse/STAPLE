import { useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import React from "react"
import CheckboxFieldTable from "src/core/components/fields/CheckboxFieldTable"
import { Form, FormProps } from "src/core/components/fields/Form"
import { LabeledTextAreaField } from "src/core/components/fields/LabeledTextAreaField"
import ToggleModal from "src/core/components/ToggleModal"
import { ProjectMemberWithUsers } from "src/core/types"
import { useSeparateProjectMembers } from "src/projectmembers/hooks/useSeparateProjectMembers"
import getProjectMembers from "src/projectmembers/queries/getProjectMembers"
import { z } from "zod"

export function AnnouncementForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const projectId = useParam("projectId", "number") // ✅ Fetch `projectId` at the component level
  // Get ProjectMembers
  const [{ projectMembers }] = useQuery(getProjectMembers, {
    where: {
      projectId: projectId,
      deleted: false,
      users: {
        every: {
          id: { not: undefined }, // Ensures there's at least one user
        },
      },
    },
    include: {
      users: true,
    },
  })

  const { individualProjectMembers, teamProjectMembers } =
    useSeparateProjectMembers<ProjectMemberWithUsers>(projectMembers as ProjectMemberWithUsers[])

  const contributorOptions = individualProjectMembers.map((contributor) => {
    return {
      // there is only one user for contributors
      label:
        contributor.users?.[0]?.firstName && contributor.users?.[0]?.lastName
          ? `${contributor.users[0].firstName} ${contributor.users[0].lastName}`
          : contributor.users?.[0]?.username || "Unknown",
      id: contributor.id,
    }
  })

  const teamOptions = teamProjectMembers.map((team) => {
    return {
      label: team.name ? team.name : "",
      id: team.id,
    }
  })

  return (
    <Form<S> {...props}>
      <LabeledTextAreaField
        className="textarea text-primary textarea-bordered textarea-primary textarea-lg bg-base-300 border-2 w-full mb-4"
        name="announcementText"
        label="Announcement Text:"
        placeholder="Type your announcement here."
      />

      <p className="text-lg mb-4">
        The default is to message all members. You can use the boxes below to select only specific
        individual collaborators or team members.
      </p>
      {/* Contributors */}
      <ToggleModal
        buttonLabel="Assign Contributor(s)"
        modalTitle="Select Contributors"
        buttonClassName="w-full mb-4 btn-info"
        saveButton={true}
      >
        <CheckboxFieldTable name="projectMembersId" options={contributorOptions} />
      </ToggleModal>
      {/* Teams */}
      <ToggleModal
        buttonLabel="Assign Team(s)"
        modalTitle="Select Teams"
        buttonClassName="w-full btn-info"
        saveButton={true}
      >
        <CheckboxFieldTable name="teamsId" options={teamOptions} />
      </ToggleModal>
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
    </Form>
  )
}
