import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "src/core/layouts/Layout";
import { UpdateProjectSchema } from "src/projects/schemas";
import getProject from "src/projects/queries/getProject";
import updateProject from "src/projects/mutations/updateProject";
import { ProjectForm, FORM_ERROR } from "src/projects/components/ProjectForm";

export const EditProject = () => {
  const router = useRouter();
  const projectId = useParam("projectId", "number");
  const [project, { setQueryData }] = useQuery(
    getProject,
    { id: projectId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  );
  const [updateProjectMutation] = useMutation(updateProject);

  return (
    <>
      <Head>
        <title>Edit Project {project.id}</title>
      </Head>

      <div>
        <h1>Edit Project {project.id}</h1>
        <pre>{JSON.stringify(project, null, 2)}</pre>
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectForm
            submitText="Update Project"
            schema={UpdateProjectSchema}
            initialValues={project}
            onSubmit={async (values) => {
              try {
                const updated = await updateProjectMutation({
                  id: project.id,
                  ...values,
                });
                await setQueryData(updated);
                await router.push(
                  Routes.ShowProjectPage({ projectId: updated.id })
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

const EditProjectPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditProject />
      </Suspense>

      <p>
        <Link href={Routes.ProjectsPage()}>Projects</Link>
      </p>
    </div>
  );
};

EditProjectPage.authenticate = true;
EditProjectPage.getLayout = (page) => <Layout>{page}</Layout>;

export default EditProjectPage;
