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
import { BsTextParagraph } from "react-icons/bs";
import { Textarea } from "../ui/textarea";

const type = FormElementEnum.ParagraphField;

const extraAttributes = {
  text: "Text here",
};

const paragraphFieldPropsSchema = z.object({
  text: z.string().min(1).max(500),
});

type ParagraphFieldInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

export const ParagraphFieldElement: FormElement = {
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
    icon: BsTextParagraph,
    label: "Paragraph field",
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
    extraAttributes: { text },
  } = elementInstance as ParagraphFieldInstance;

  const { updateElement } = useDesigner();
  const form = useForm<ParagraphFieldPropsSchemaType>({
    resolver: zodResolver(paragraphFieldPropsSchema),
    mode: "onBlur",
    defaultValues: {
      text,
    },
  });

  useEffect(() => {
    form.setFocus("text", { shouldSelect: true });
  }, [elementInstance, form, form.setFocus]);

  useEffect(() => {
    form.reset(elementInstance.extraAttributes);
  }, [form, elementInstance]);

  function applyChanges(values: ParagraphFieldPropsSchemaType) {
    const { text } = values;
    updateElement(id, {
      ...elementInstance,
      extraAttributes: {
        text,
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
          name="text"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Text</FormLabel>
                <FormControl>
                  <Textarea
                    rows={5}
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
    extraAttributes: { text },
  } = elementInstance as ParagraphFieldInstance;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-muted-foreground">Paragraph Field</Label>
      <p className="">{text}</p>
    </div>
  );
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const {
    extraAttributes: { text },
  } = elementInstance as ParagraphFieldInstance;

  return <p className="">{text}</p>;
}

type ParagraphFieldPropsSchemaType = z.infer<typeof paragraphFieldPropsSchema>;
