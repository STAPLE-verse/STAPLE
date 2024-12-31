import db from "db"

export const linkDefaultFormToProjects = async () => {
  const projects = await db.project.findMany({
    include: {
      projectMembers: {
        include: {
          users: true, // Include the linked users for each project member
        },
      },
    },
  })

  for (const project of projects) {
    // Assuming the first member is the project owner
    // and that they are the only user in the array
    const user = project.projectMembers[0]?.users[0]

    if (user) {
      const defaultForm = await db.form.findFirst({
        where: {
          userId: user.id,
          versions: {
            some: {
              schema: {
                path: ["description"], // Path to "description" key in the schema JSON
                equals: "Default Project Metadata",
              },
            },
          },
        },
        include: { versions: true },
      })

      if (defaultForm && defaultForm.versions[0]) {
        // Update the project to link to the formVersionId
        await db.project.update({
          where: { id: project.id },
          data: {
            formVersionId: defaultForm.versions[0].id,
          },
        })

        console.log(
          `Linked formVersionId ${defaultForm.versions[0].id} to project ID: ${project.id}`
        )
      }
    }
  }
}
