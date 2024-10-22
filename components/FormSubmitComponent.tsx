"use client";
import { FormElementInstance } from "@/lib/form-builder/types";
import React, {
  startTransition,
  useCallback,
  useRef,
  useState,
  useTransition,
} from "react";
import { formElementGroup } from "./FormElement";
import { Button } from "./ui/button";
import { HiCursorClick } from "react-icons/hi";
import { toast } from "./ui/use-toast";
import { ImSpinner3 } from "react-icons/im";
import { submitForm } from "@/actions/form";

function FormSubmitComponent({
  url,
  content,
}: {
  url: string;
  content: FormElementInstance[];
}) {
  // prevent rerender
  const formValues = useRef<{ [key: string]: string }>({});
  const formErrors = useRef<{ [key: string]: boolean }>({});
  const [renderKey, setRenderKey] = useState(Date.now());

  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  const validateForm = useCallback(() => {
    for (const field of content) {
      const val = formValues.current[field.id] || "";
      const isValid = formElementGroup[field.type].validate(field, val);

      if (!isValid) {
        formErrors.current[field.id] = true;
      }
    }

    if (Object.keys(formErrors.current).length > 0) {
      return false;
    }

    return true;
  }, [content]);

  const submitValueFn = (key: string, value: string) => {
    formValues.current[key] = value;
  };

  const handleSubmit = async () => {
    formErrors.current = {};
    const isValidForm = validateForm();
    if (!isValidForm) {
      setRenderKey(Date.now());
      toast({
        title: "Error",
        variant: "destructive",
        description: "Please check the form for errors",
      });
      return;
    }

    try {
      const contentJSON = JSON.stringify(formValues.current);
      await submitForm(url, contentJSON);
      setSubmitted(true);
    } catch (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Something went wrong",
      });
    }
  };

  if (submitted) {
    return (
      <div className="flex justify-center w-full h-full items-center p-4">
        <div className="flex flex-col gap-4 flex-grow bg-background max-w-[620px] p-4 overflow-y-auto border shadow-xl shadow-blue-700 rounded">
          <h1 className="text-xl font-bold"> Form Submitted</h1>
          <p className="text-muted-foreground">Thank you for submission</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full h-full items-center p-8">
      <div
        key={renderKey}
        className="flex max-w-[620px] flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded"
      >
        {content.map((el) => {
          const FormElement = formElementGroup[el.type].formComponent;
          return (
            <FormElement
              key={el.id}
              elementInstance={el}
              submitFn={submitValueFn}
              isValid={formErrors.current[el.id]}
              defaultValue={formValues.current[el.id]}
            />
          );
        })}
        <Button
          disabled={pending}
          className="mt-4"
          onClick={() => handleSubmit()}
        >
          {!pending && (
            <>
              <HiCursorClick className="mr-2" />
              Submit
            </>
          )}
          {pending && (
            <>
              <ImSpinner3 className="animate-spin" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default FormSubmitComponent;
