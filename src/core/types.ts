import {
  Project,
  ProjectMember,
  Role,
  Task,
  TaskLog,
  User,
  Comment,
  KanbanBoard,
  FormVersion,
  Element,
} from "db"

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

export type CommentWithAuthor = Comment & {
  author: ProjectMember & {
    users: Pick<User, "id" | "username" | "firstName" | "lastName">[]
  }
}

export type ProjectMemberWithUsersAndRoles = ProjectMember & {
  users: User[]
  roles: Array<Pick<Role, "id" | "name">>
}

// Define the TaskLogWithTaskCompleted type
export type TaskLogWithTaskCompleted = TaskLog & {
  task: TaskWithRoles
  completedBy: ProjectMemberWithUsers
}

export type ExtendedProjectMember = ProjectMember & {
  users: Pick<User, "id" | "username">[]
}

export type ExtendedTaskLog = TaskLog & {
  completedBy: ExtendedProjectMember
  comments?: Comment[]
  assignedTo: ExtendedProjectMember
}

export type ProjectMemberWithTaskLog = ProjectMember & {
  taskLogAssignedTo: ExtendedTaskLog[]
  users: Pick<User, "id" | "username">[]
}

export type TaskLogWithCompletedBy = TaskLog & {
  completedBy: ExtendedProjectMember
  assignedTo: ExtendedProjectMember
}

export type ExtendedTask = Task & {
  container: KanbanBoard
  element: Element | null
  formVersion: FormVersion | null
  roles: []
  assignedMembers: ProjectMemberWithTaskLog[]
  taskLogs: TaskLogWithCompletedBy[]
}

export type RouteData = {
  path: string
  params?: Record<string, any>
}

// Define the ProjectWithMembers type
export type ProjectWithMembers = Project & {
  projectMembers: ProjectMemberWithUsers[]
}
