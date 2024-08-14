import { getFormById } from "@/actions/form";
import FormBuilder from "@/components/FormBuilder";
import React from "react";

interface builderPagePropsType {
  params: {
    formId: string;
  };
}

async function Page({ params: { formId } }: builderPagePropsType) {
  const form = await getFormById(formId);
  if (!form) {
    throw new Error("Form not found");
  }
  return (
    <>
      <FormBuilder form={form} />
    </>
  );
}

export default Page;
