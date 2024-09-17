import ProjectMemberNumber from "../components/widgets/ProjectMemberNumber"
import ElementSummary from "../components/widgets/ElementSummary"
import FormNumber from "../components/widgets/FormNumber"
import LabelsSummary from "../components/widgets/LabelsSummary"
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

export const widgetRegistry = {
  main: {
    LastProject: LastProject,
    Notifications: MainNotification,
    OverdueTask: MainOverdueTasks,
    UpcomingTask: MainUpcomingTasks,
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
    LabelsSummary: LabelsSummary,
  },
}
