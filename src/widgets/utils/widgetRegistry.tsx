import ProjectMemberNumber from "../components/widgets/ProjectMemberNumber"
import ElementSummary from "../components/widgets/ElementSummary"
import FormNumber from "../components/widgets/FormNumber"
import RolesSummary from "../components/widgets/RolesSummary"
import LastProject from "../components/widgets/LastProject"
import MainNotification from "../components/widgets/MainNotification"
import MainOverdueTasks from "../components/widgets/MainOverDueTasks"
import MainUpcomingTasks from "../components/widgets/MainUpcomingTasks"
import ProjectNotification from "../components/widgets/ProjectNotification"
import ProjectOverdueTasks from "../components/widgets/ProjectOverdueTasks"
import ProjectSummary from "../components/widgets/ProjectSummary"
import ProjectUpcomingTasks from "../components/widgets/ProjectUpcomingTasks"
import TaskTotal from "../components/widgets/TaskTotal"
import TeamNumber from "../components/widgets/TeamNumber"
import AllTaskTotal from "../components/widgets/AllTaskTotal"
import TotalContributors from "../components/widgets/TotalContributors"
import TotalForms from "../components/widgets/TotalForms"
import TotalInvites from "../components/widgets/TotalInvites"
import TotalProjects from "../components/widgets/TotalProjects"
import TotalRoles from "../components/widgets/TotalRoles"

export const widgetRegistry = {
  main: {
    LastProject: LastProject,
    Notifications: MainNotification,
    OverdueTask: MainOverdueTasks,
    UpcomingTask: MainUpcomingTasks,
    AllTaskTotal: AllTaskTotal,
    TotalContributors: TotalContributors,
    TotalForms: TotalForms,
    TotalInvites: TotalInvites,
    TotalProjects: TotalProjects,
    TotalRoles: TotalRoles,
  },
  project: {
    ProjectSummary: ProjectSummary,
    OverdueTask: ProjectOverdueTasks,
    UpcomingTask: ProjectUpcomingTasks,
    Notifications: ProjectNotification,
    ProjectMemberNumber: ProjectMemberNumber,
    TeamNumber: TeamNumber,
    FormNumber: FormNumber,
    TaskTotal: TaskTotal,
    ElementSummary: ElementSummary,
    RolesSummary: RolesSummary,
  },
}
