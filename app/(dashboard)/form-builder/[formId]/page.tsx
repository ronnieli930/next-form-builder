import { getFormById } from "@/actions/form";
import FormBuilder from "@/components/FormBuilder";
import React, { Suspense } from "react";
import { ImSpinner2 } from "react-icons/im";

interface builderPagePropsType {
  params: {
    formId: string;
  };
}

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <ImSpinner2 className="animate-spin h-12 w-12" />
    </div>
  );
}

async function DataLoader({ formId }: { formId: string }) {
  const form = await getFormById(formId);

  if (!form) {
    throw new Error("Form not found");
  }

  return <FormBuilder form={form} />;
}

async function Page({ params: { formId } }: builderPagePropsType) {
  return (
    <Suspense fallback={<Spinner />}>
      <DataLoader formId={formId} />
    </Suspense>
  );
}

export default Page;
