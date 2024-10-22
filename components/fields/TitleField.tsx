"use client";
import {
  FormElement,
  FormElementEnum,
  FormElementInstance,
} from "@/lib/form-builder/types";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import useDesigner from "@/hooks/useDesigner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { LuHeading1 } from "react-icons/lu";

const type = FormElementEnum.TitleField;

const extraAttributes = {
  title: "Title field",
};

const titleFieldPropsSchema = z.object({
  title: z.string().min(1).max(50),
});

type TitleFieldInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

export const TitleFieldElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propsComponent: PropsComponent,
  designerBtnElement: {
    icon: LuHeading1,
    label: "Title field",
  },
  validate: () => true,
};

function PropsComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const {
    id,
    extraAttributes: { title },
  } = elementInstance as TitleFieldInstance;

  const { updateElement } = useDesigner();
  const form = useForm<TitleFieldPropsSchemaType>({
    resolver: zodResolver(titleFieldPropsSchema),
    mode: "onBlur",
    defaultValues: {
      title,
    },
  });

  useEffect(() => {
    form.setFocus("title", { shouldSelect: true });
  }, [elementInstance, form, form.setFocus]);

  useEffect(() => {
    form.reset(elementInstance.extraAttributes);
  }, [form, elementInstance]);

  function applyChanges(values: TitleFieldPropsSchemaType) {
    const { title } = values;
    updateElement(id, {
      ...elementInstance,
      extraAttributes: {
        title,
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => e.preventDefault()}
        onBlur={form.handleSubmit(applyChanges)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.currentTarget.blur();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </form>
    </Form>
  );
}

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const {
    extraAttributes: { title },
  } = elementInstance as TitleFieldInstance;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-muted-foreground">Title Field</Label>
      <p className="text-xl">{title}</p>
    </div>
  );
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const {
    extraAttributes: { title },
  } = elementInstance as TitleFieldInstance;

  return <p className="text-xl">{title}</p>;
}

type TitleFieldPropsSchemaType = z.infer<typeof titleFieldPropsSchema>;