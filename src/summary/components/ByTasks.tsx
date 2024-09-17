import React from "react"
import { ContributorsView, TaskView, TeamView } from "src/summary/components/UtilsViews"

const ByTasks = ({ tasks, projectMembers, teams }) => {
  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">By task organization</h1>

      <div className="my-2 ">
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
      <div className="my-2 ">
        <h2>Contributors Summary</h2>
        {projectMembers.map((conInfo) => (
          <ContributorsView
            projectMember={conInfo}
            tasks={[]}
            printTask={false}
            // id={conInfo.id}
            key={conInfo.id}
            printRoles={true}
          ></ContributorsView>
        ))}
      </div>

      <div className="my-2 ">
        <h2>Tasks Summary</h2>
        {tasks.map((task) => (
          <TaskView task={task} key={task.id} printRoles={true} printAssignees={true}></TaskView>
        ))}
      </div>
    </main>
  )
}

export default ByTasks
