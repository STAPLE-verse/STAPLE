import { Project, ProjectMember, Role, Task, TaskLog, User } from "db"

export type RoleWithUser = Role & {
  user: User
}

export type TaskWithRoles = Task & {
  roles?: Role[]
}

export type TaskLogWithTask = TaskLog & {
  task: Task
}

export type TaskLogWithTaskAndProject = TaskLog & {
  task: Task & {
    project: Project
  }
}

export type TaskLogWithTaskRoles = TaskLog & {
  task: TaskWithRoles
}

export type ProjectMemberWithUsers = ProjectMember & {
  users: User[]
}

export type ProjectMemberWithUsername = ProjectMember & {
  users: {
    username: string
  }
}

export type ProjectMemberWithUsersAndRoles = ProjectMember & {
  users: Array<Pick<User, "id" | "firstName" | "lastName" | "username">>
  roles: Array<Pick<Role, "id" | "name">>
}

// Define the TaskLogWithTaskCompleted type
export type TaskLogWithTaskCompleted = TaskLog & {
  task: TaskWithRoles
  completedBy: ProjectMemberWithUsers
}
