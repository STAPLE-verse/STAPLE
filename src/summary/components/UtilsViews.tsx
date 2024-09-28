import { AssignmentStatus, CompletedAs } from "db"
import DateFormat from "src/core/components/DateFormat"

export const TaskView = ({
  task,
  printLabels = false,
  printAssignees = false,
  printElement = true,
}) => {
  let user = task.createdBy.user

  const getLatest = (statusLog) => {
    if (statusLog.length === 0) {
      return {}
    }

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

  const getAssignmentCompletedBy = (task, lastChanged) => {
    const changedAssignment = task.assignees.find(
      (element) => lastChanged.assignmentId == element.id
    )
    return changedAssignment
  }

  const lastChangedLog = getLastUpdated(task.assignees)
  const lastChangedByAssignment = getAssignmentCompletedBy(task, lastChangedLog)

  return (
    <div className="my-1 " data-testid="taskview-testid">
      <h5>Name: {task.name} </h5>
      Description: {task.description}
      <br />
      Created At: <DateFormat date={task.createdAt}></DateFormat>
      <br />
      Updated At: <DateFormat date={lastChangedLog.createdAt}></DateFormat>
      <br />
      Created By: {user.firstName} {user.lastName}
      {printAssignees && (
        <div>
          {task.assignees.length < 0 && <h6>The task does have assignees</h6>}
          {task.assignees.length > 0 && <h6>Assigned to:</h6>}
          {task.assignees.map((assignment) => (
            <div key={assignment.id} className="">
              {assignment.team != null && <span>Team Name: {assignment.team.name} </span>}
              {assignment.contributor != null && (
                <span>
                  Contributor Name: {assignment.contributor.user.firstName}{" "}
                  {assignment.contributor.user.lastName}{" "}
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
                  {lastChangedByAssignment.contributor.user.firstName}{" "}
                  {lastChangedByAssignment.contributor.user.lastName}
                </span>
              </div>
            )}
          </div>
          <div>
            {lastChangedLog.completedAs == CompletedAs.TEAM && (
              <div>
                Completed as a team by: <span>{lastChangedByAssignment.team.name}</span>
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
      {/* Metadata:assignmentstatuslog.metadata (if exists) */}
      <br />
    </div>
  )
}

export const TeamView = ({ team, tasks, printTask = false }) => {
  return (
    <div className="my-2">
      <h5> Name: {team.name} </h5>
      Created: <DateFormat date={team.createdAt}></DateFormat>
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
          {tasks.length < 1 && <h5>This team does not have completed assignments</h5>}
          <div>
            {tasks.length > 0 && <h5>Tasks with completed assignments</h5>}
            {tasks.map((task) => (
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
      Added to Project: <DateFormat date={contributor.createdAt}></DateFormat>
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
          {newTasks.length < 1 && <h5>This contributor does not have completed assignments</h5>}
          {newTasks.length > 0 && <h5>Tasks with completed assignments</h5>}
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
      Description: {label.description}
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

export const compareDateSeconds = (d1, d2) => {
  var d1Seconds = Math.round(d1.getTime() / 1000)
  var d2Seconds = Math.round(d2.getTime() / 1000)

  return d1Seconds == d2Seconds
}

export const DateLogView = ({ tasks, contributors, log, teams, printHeader }) => {
  const getTasksForDate = (tasks, log) => {
    const t = tasks.filter(
      (task) => log.belongsTo == "task" && task.id == log.elementId
      // compareDateSeconds(task.updatedAt, log.createdAt) ||
      // compareDateSeconds(task.createdAt, log.createdAt)
    )
    return t
  }

  const getTeamsForDate = (teams, log) => {
    const t = teams.filter((team) => log.belongsTo == "team" && team.id == log.elementId)
    return t
  }

  const getContributorForDate = (contributors, log) => {
    let t
    if (log.belongsTo == "contributor") {
      t = contributors.filter((contributor) => contributor.id == log.elementId)
    }
    //  else if (log.belongsTo == "contributor" && !log.fromLog){
    //   t = contributors.filter((contributor) => contributor.id == log.elementId)
    // }
    else {
      t = contributors.filter((contributor) =>
        compareDateSeconds(contributor.createdAt, log.createdAt)
      )
    }

    return t
  }

  let filteredTask = getTasksForDate(tasks, log)
  let filteredContributors = getContributorForDate(contributors, log)
  let filteredTeams = getTeamsForDate(teams, log)

  return (
    <div>
      {printHeader && (
        <h3>
          {" "}
          Date: <DateFormat date={log.createdAt}></DateFormat>
        </h3>
      )}
      {/* {filteredContributors.length < 1 && <h4>Not activity for contributors</h4>} */}
      {filteredContributors.length > 0 && (
        <div className="my-1">
          <h5>Contributor created or updated</h5>
          {filteredContributors.map((contributor) => (
            <ContributorsView
              contributor={contributor}
              tasks={[]}
              printTask={false}
              key={contributor.id}
              printLabels={true}
            ></ContributorsView>
          ))}
        </div>
      )}

      {/* {filteredTeams.length < 1 && <h4>Not activity for teams</h4>} */}
      {filteredTeams.length > 0 && (
        <div className="my-1">
          <h6>Team created or updated</h6>
          {filteredTeams.map((team) => (
            <TeamView team={team} tasks={[]} printTask={false} key={team.id}></TeamView>
          ))}
        </div>
      )}

      {/* {filteredTask.length < 1 && <h4>Not activity for tasks</h4>} */}
      {filteredTask.length > 0 && (
        <div className="my-1">
          <h6>Task created or updated</h6>
          {filteredTask.map((task) => (
            <TaskView task={task} key={task.id} printLabels={true} printAssignees={true}></TaskView>
          ))}
        </div>
      )}
    </div>
  )
}
