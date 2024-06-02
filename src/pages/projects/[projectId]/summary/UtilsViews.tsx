import { formatDate } from "src/services/formatDate"
import { ContributorInformation, TeamInformation } from "./flattenTasksInformation"
import { teamAssignmentTableColumns } from "src/assignments/components/TeamAssignmentTable"
import { AssignmentStatus, CompletedAs } from "db"

export const TaskView = ({
  task,
  printLabels = false,
  printAssignees = false,
  printElement = true,
}) => {
  // console.log(task)
  let user = task.createdBy.user

  // console.log(task)

  const getLatest = (statusLog) => {
    const max = statusLog.reduce(function (prev, current) {
      return prev && prev.createdAt > current.createdAt ? prev : current
    })
    return max
  }

  const getLastUpdated = (assignees) => {
    const maxs: any[] = []
    assignees.forEach((element) => {
      let max = getLatest(element.statusLogs)
      maxs.push(max)
    })
    const last = getLatest(maxs)
    return last
  }

  const getAssigmentCompletedBy = (task, lastChanged) => {
    const changedAssigment = task.assignees.find(
      (element) => lastChanged.assignmentId == element.id
    )
    return changedAssigment
  }

  const lastChangedLog = getLastUpdated(task.assignees)
  const lastChangedByAssigment = getAssigmentCompletedBy(task, lastChangedLog)

  return (
    <div className="my-1 ">
      <h5>Name: {task.name} </h5>
      Description: {task.description}
      <br />
      Created At: {formatDate(task.createdAt)}
      <br />
      Updated At: {formatDate(lastChangedLog.changedAt)}
      <br />
      Created By: {user.firstName} {user.lastName}
      {printAssignees && (
        <div>
          {task.assignees.length < 0 && <h6>The task does have assignees</h6>}
          {task.assignees.length > 0 && <h6>Assigned to:</h6>}
          {task.assignees.map((assigment) => (
            <div key={assigment.id} className="">
              {assigment.team != null && <span>Team Name: {assigment.team.name} </span>}
              {assigment.contributor != null && (
                <span>
                  Contributor Name: {assigment.contributor.user.firstName}{" "}
                  {assigment.contributor.user.lastName}{" "}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      {/* TODO refactor this */}
      {lastChangedLog.status == AssignmentStatus.NOT_COMPLETED && (
        <h6>The task is not completed</h6>
      )}
      {lastChangedLog.status == AssignmentStatus.COMPLETED && (
        <div>
          <div>
            {lastChangedLog.completedAs == CompletedAs.INDIVIDUAL && (
              <div>
                Completed as an individual by:{" "}
                <span>
                  {" "}
                  {lastChangedByAssigment.contributor.user.firstName}{" "}
                  {lastChangedByAssigment.contributor.user.lastName}
                </span>
              </div>
            )}
          </div>
          <div>
            {lastChangedLog.completedAs == CompletedAs.TEAM && (
              <div>
                Completed as a team by: <span>{lastChangedByAssigment.team.name}</span>
              </div>
            )}
          </div>
        </div>
      )}
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
      {printElement && (
        <div>
          {task.element != undefined ? (
            <span>Element: {task.element.name}</span>
          ) : (
            <span>This task does not have element</span>
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
    <div className="my-2">
      <h5> Name: {team.name} </h5>
      Created: {formatDate(team.createdAt)}
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

export const LabelView = ({
  label,
  contributors,
  tasks,
  printTask = false,
  printContributor = false,
}) => {
  return (
    <div className="my-2">
      <h5> Name: {label.name} </h5>
      Description: {label.desciprition}
      <br />
      Taxonomy: {label.taxonomy}
      {printContributor && (
        <div>
          <h6>Contributors</h6>
          {contributors.length < 1 && <h6>This label does not have contributors</h6>}
          {contributors.map((element) => (
            <div key={element.id}>
              user: {element.user.firstName} {element.user.lastName}
            </div>
          ))}
        </div>
      )}
      {printTask && (
        <div>
          <h6>Tasks</h6>
          {tasks.length < 1 && <h6>This label does not have tasks</h6>}
          {tasks.map((task) => (
            <TaskView key={task.id} task={task} printAssignees={true}></TaskView>
          ))}
        </div>
      )}
    </div>
  )
}

export const ElementView = ({ element, task, printTask = false }) => {
  return (
    <div>
      <h5> Element Name: {element.name} </h5>
      Description: {element.description}
      {printTask && (
        <div>
          {task == undefined && <h5>The element does not have a task </h5>}
          {task && <h6>Element Task </h6>}
          {task && (
            <TaskView
              key={task.id}
              task={task}
              printAssignees={true}
              printElement={false}
              printLabels={true}
            ></TaskView>
          )}
        </div>
      )}
    </div>
  )
}
