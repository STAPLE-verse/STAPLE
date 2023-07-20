import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "src/core/layouts/Layout";
import { UpdateElementSchema } from "src/elements/schemas";
import getElement from "src/elements/queries/getElement";
import updateElement from "src/elements/mutations/updateElement";
import { ElementForm, FORM_ERROR } from "src/elements/components/ElementForm";

export const EditElement = () => {
  const router = useRouter();
  const elementId = useParam("elementId", "number");
  const [element, { setQueryData }] = useQuery(
    getElement,
    { id: elementId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  );
  const [updateElementMutation] = useMutation(updateElement);

  return (
    <>
      <Head>
        <title>Edit Element {element.id}</title>
      </Head>

      <div>
        <h1>Edit Element {element.id}</h1>
        <pre>{JSON.stringify(element, null, 2)}</pre>
        <Suspense fallback={<div>Loading...</div>}>
          <ElementForm
            submitText="Update Element"
            schema={UpdateElementSchema}
            initialValues={element}
            onSubmit={async (values) => {
              try {
                const updated = await updateElementMutation({
                  id: element.id,
                  ...values,
                });
                await setQueryData(updated);
                await router.push(
                  Routes.ShowElementPage({ elementId: updated.id })
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

const EditElementPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditElement />
      </Suspense>

      <p>
        <Link href={Routes.ElementsPage()}>Elements</Link>
      </p>
    </div>
  );
};

EditElementPage.authenticate = true;
EditElementPage.getLayout = (page) => <Layout>{page}</Layout>;

export default EditElementPage;
