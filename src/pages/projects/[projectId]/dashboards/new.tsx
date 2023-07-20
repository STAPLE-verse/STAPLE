import { Routes } from "@blitzjs/next";
import Link from "next/link";
import { useParam } from "@blitzjs/next";
import { useRouter } from "next/router";
import { useMutation } from "@blitzjs/rpc";
import Layout from "src/core/layouts/Layout";
import { CreateDashboardSchema } from "src/dashboards/schemas";
import createDashboard from "src/dashboards/mutations/createDashboard";
import {
  DashboardForm,
  FORM_ERROR,
} from "src/dashboards/components/DashboardForm";
import { Suspense } from "react";

const NewDashboardPage = () => {
  const router = useRouter();
  const projectId = useParam("projectId", "number");
  const [createDashboardMutation] = useMutation(createDashboard);

  return (
    <Layout title={"Create New Dashboard"}>
      <h1>Create New Dashboard</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardForm
          submitText="Create Dashboard"
          schema={CreateDashboardSchema}
          // initialValues={{}}
          onSubmit={async (values) => {
            try {
              const dashboard = await createDashboardMutation({
                ...values,
                projectId: projectId!,
              });
              await router.push(
                Routes.ShowDashboardPage({
                  projectId: projectId!,
                  dashboardId: dashboard.id,
                })
              );
            } catch (error: any) {
              console.error(error);
              return {
                [FORM_ERROR]: error.toString(),
              };
            }
          }}
        />
      </Suspense>
      <p>
        <Link href={Routes.DashboardsPage({ projectId: projectId! })}>
          Dashboards
        </Link>
      </p>
    </Layout>
  );
};

NewDashboardPage.authenticate = true;

export default NewDashboardPage;
