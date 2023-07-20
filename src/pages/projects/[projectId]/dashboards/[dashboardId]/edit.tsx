import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "src/core/layouts/Layout";
import { UpdateDashboardSchema } from "src/dashboards/schemas";
import getDashboard from "src/dashboards/queries/getDashboard";
import updateDashboard from "src/dashboards/mutations/updateDashboard";
import {
  DashboardForm,
  FORM_ERROR,
} from "src/dashboards/components/DashboardForm";

export const EditDashboard = () => {
  const router = useRouter();
  const dashboardId = useParam("dashboardId", "number");
  const projectId = useParam("projectId", "number");
  const [dashboard, { setQueryData }] = useQuery(
    getDashboard,
    { id: dashboardId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  );
  const [updateDashboardMutation] = useMutation(updateDashboard);

  return (
    <>
      <Head>
        <title>Edit Dashboard {dashboard.id}</title>
      </Head>

      <div>
        <h1>Edit Dashboard {dashboard.id}</h1>
        <pre>{JSON.stringify(dashboard, null, 2)}</pre>
        <Suspense fallback={<div>Loading...</div>}>
          <DashboardForm
            submitText="Update Dashboard"
            schema={UpdateDashboardSchema}
            initialValues={dashboard}
            onSubmit={async (values) => {
              try {
                const updated = await updateDashboardMutation({
                  id: dashboard.id,
                  ...values,
                });
                await setQueryData(updated);
                await router.push(
                  Routes.ShowDashboardPage({
                    projectId: projectId!,
                    dashboardId: updated.id,
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
      </div>
    </>
  );
};

const EditDashboardPage = () => {
  const projectId = useParam("projectId", "number");

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditDashboard />
      </Suspense>

      <p>
        <Link href={Routes.DashboardsPage({ projectId: projectId! })}>
          Dashboards
        </Link>
      </p>
    </div>
  );
};

EditDashboardPage.authenticate = true;
EditDashboardPage.getLayout = (page) => <Layout>{page}</Layout>;

export default EditDashboardPage;
