import React from "react"
import { ProjectMembersView, ElementView, TeamView } from "src/summary/components/UtilsViews"

const ByElements = ({ elements, teams, projectMembers, tasks }) => {
  const getElementTask = (elementId, tasks) => {
    let r = tasks.find((task) => task.element != null && task.elementId == elementId)
    return r
  }
  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">By elements organization</h1>
      <div>
        {/* <h2>Elements Summary</h2> */}
        <div>
          <h2>Contributors Summary</h2>
          {projectMembers.map((projectMember) => (
            <ProjectMembersView
              projectMember={projectMember}
              tasks={[]}
              // id={projectMember.id}
              key={projectMember.id}
              printTask={false}
            ></ProjectMembersView>
          ))}
        </div>
        <div>
          <h2>Teams Summary</h2>
          {teams.map((teamInfo) => (
            <TeamView
              team={teamInfo}
              tasks={[]}
              // id={teamInfo.id}
              key={teamInfo.id}
              printTask={false}
            ></TeamView>
          ))}
        </div>
        <div>
          <h2>Elements Summary</h2>
          {elements.map((element) => (
            <ElementView
              element={element}
              task={getElementTask(element.id, tasks)}
              key={element.id}
              printTask={true}
            ></ElementView>
          ))}
        </div>
      </div>
    </main>
  )
}

export default ByElements
