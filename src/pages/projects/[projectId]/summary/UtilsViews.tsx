import { formatDate } from "src/services/formatDate"
import { ContributorInformation, TeamInformation } from "./flattenTasksInformation"

export const TaskView = ({ task, printLabels = false }) => {
  // console.log(task)
  let user = task.createdBy.user

  console.log(task)

  return (
    <div className="my-2 ">
      <h3>Name: {task.name} </h3>
      Description:{task.description}
      <br />
      Created At: {formatDate(task.createdAt)}
      <br />
      Updated At:
      <br />
      Created By: {user.firstName} {user.lastName}
      <br />
      Completed By:assignmentstatuslog.completedBy
      {printLabels && (
        <div className="">
          {task.labels.length < 1 && <h6>This task does not have labels</h6>}
          {task.labels.length > 0 && (
            <div>
              Contribution Categories:
              {task.labels.map((label) => (
                <span key={label.id} className="mx-2">
                  {label.name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
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
        <h6>Members</h6>
        {team.contributors.map((element) => (
          <div key={element.id}>
            name: {element.user.firstName} {element.user.lastName}
          </div>
        ))}
      </div>
      {printTask && (
        <div className="my-2 ">
          {newTasks.length < 1 && <h5>This team does not have completed assigments</h5>}
          <div>
            {newTasks.length > 0 && <h5>Tasks with completed assigments</h5>}
            {newTasks.map((task) => (
              <TaskView key={task.id} task={task}></TaskView>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export const ContributorsView = ({
  contributor,
  tasks,
  id,
  printTask = false,
  printLabels = false,
}) => {
  // console.log(contributor)
  //TODO Needs to sort and filter tasks
  let newTasks = tasks
  return (
    <div>
      <br />
      <h6>
        name: {contributor.user.firstName} {contributor.user.lastName}
      </h6>
      Added to Project: {formatDate(contributor.createdAt)}
      <br />
      {printLabels && (
        <div className="">
          {contributor.labels.length < 1 && <h6>This contributor does not have labels</h6>}
          {contributor.labels.length > 0 && (
            <div>
              Contribution Categories:
              {contributor.labels.map((label) => (
                <span key={label.id} className="mx-2">
                  {label.name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
      {printTask && (
        <div className="my-2 ">
          {newTasks.length < 1 && <h5>This contributor does not have completed assigments</h5>}
          {newTasks.length > 0 && <h5>Tasks with completed assigments</h5>}
          {newTasks.map((task) => (
            <TaskView key={task.id} task={task}></TaskView>
          ))}
        </div>
      )}
    </div>
  )
}

export const LabelView = ({ label, contributors, tasks, printTask = false }) => {
  let newTasks = tasks
  return (
    <div>
      <h6> Name: {label.name} </h6>
      Description: {label.desciprition}
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
