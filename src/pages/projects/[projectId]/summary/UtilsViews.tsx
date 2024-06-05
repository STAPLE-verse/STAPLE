import { formatDate } from "src/services/formatDate"
import { ContributorInformation, TeamInformation } from "./flattenTasksInformation"

export const TaskView = ({ task }) => {
  // console.log(task)
  let user = task.createdBy.user

  return (
    <div className="my-2 ">
      <h6>Name: {task.name} </h6>
      Description:{task.description}
      <br />
      Created At: {formatDate(task.createdAt)}
      <br />
      Updated At:
      <br />
      Created By: {user.username}
      <br />
      Completed By:assignmentstatuslog.completedBy
      <br />
      Contribution Categories:tasks.labels
      <br />
      Metadata:assignmentstatuslog.metadata (if exists)
      <br />
    </div>
  )
}

export const TeamView = ({ team, tasks, id, printTask = false }) => {
  // console.log(team)
  //TODO Needs to sort and filter tasks
  let newTasks = tasks

  return (
    <div>
      <br />
      <h3> Name: {team.name} </h3>
      Created: {formatDate(team.createdAt)}
      <br />
      <div>
        <h5>Members</h5>
        {team.contributors.map((element) => (
          <div key={element.id}>user name: {element.user.username}</div>
        ))}
      </div>
      {printTask && (
        <div>
          <br />
          {newTasks.length > 0 && <h5>Tasks with completed assigments</h5>}

          {newTasks.map((task) => (
            <TaskView key={task.id} task={task}></TaskView>
          ))}
        </div>
      )}
    </div>
  )
}

export const ContributorsView = ({ contributor, tasks, id, printTask = false }) => {
  // console.log(contributor)
  //TODO Needs to sort and filter tasks
  let newTasks = tasks
  return (
    <div>
      <br />
      <h3> Username: {contributor.user.username} </h3>
      Added to Project: {formatDate(contributor.createdAt)}
      <br />
      Contribution Categories: contributor.labels
      {printTask && (
        <div>
          <br />
          {newTasks.length > 0 && <h5>Tasks with completed assigments</h5>}
          {newTasks.map((task) => (
            <TaskView key={task.id} task={task}></TaskView>
          ))}
        </div>
      )}
    </div>
  )
}

export const LabelView = ({ label, contributors, id, tasks, printTask = false }) => {
  let newTasks = tasks
  return (
    <div>
      <br />
      <h3> Name: {label.name} </h3>
      Description: {label.description}
      <br />
      Taxonomy: {label.taxonomy}
      <br />
      <div>
        <h5>Contributors</h5>
        {contributors.map((element) => (
          <div key={element.id}>user name: {element.user.username}</div>
        ))}
      </div>
      {printTask && (
        <div>
          <br />
          <h5>Tasks with completed assigments</h5>

          {newTasks.map((task) => (
            <TaskView key={task.id} task={task}></TaskView>
          ))}
        </div>
      )}
    </div>
  )
}

export const ElementView = ({ element, tasks, printTask = false }) => {
  let newTasks = tasks
  return (
    <div>
      <br />
      <h3> Name: {element.name} </h3>
      Description: {element.description}
      <br />
      {printTask && (
        <div>
          <br />
          {newTasks.length > 0 && <h5>Tasks </h5>}

          {newTasks.map((task) => (
            <TaskView key={task.id} task={task}></TaskView>
          ))}
        </div>
      )}
    </div>
  )
}
