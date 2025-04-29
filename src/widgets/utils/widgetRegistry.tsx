import ProjectMemberNumber from "../components/widgets/ProjectMemberNumber"
import ElementSummary from "../components/widgets/ProjectElements"
import FormNumber from "../components/widgets/ProjectForms"
import RolesSummary from "../components/widgets/ProjectRoles"
import LastProject from "../components/widgets/MainLastProject"
import MainNotification from "../components/widgets/MainNotification"
import MainOverdueTasks from "../components/widgets/MainOverDueTasks"
import MainUpcomingTasks from "../components/widgets/MainUpcomingTasks"
import ProjectNotification from "../components/widgets/ProjectNotification"
import ProjectOverdueTasks from "../components/widgets/ProjectOverdueTasks"
import ProjectSummary from "../components/widgets/ProjectSummary"
import ProjectUpcomingTasks from "../components/widgets/ProjectUpcomingTasks"
import TaskTotal from "../components/widgets/ProjectTasks"
import TeamNumber from "../components/widgets/ProjectTeams"
import AllTaskTotal from "../components/widgets/MainTotalTask"
import TotalContributors from "../components/widgets/MainTotalContributors"
import TotalForms from "../components/widgets/MainTotalForms"
import TotalInvites from "../components/widgets/MainTotalInvites"
import TotalProjects from "../components/widgets/MainTotalProjects"
import TotalRoles from "../components/widgets/MainTotalRoles"

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
