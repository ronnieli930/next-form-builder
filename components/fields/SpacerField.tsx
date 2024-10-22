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
import { LuHeading1, LuSeparatorHorizontal } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { Slider } from "../ui/slider";

const type = FormElementEnum.SpacerField;

const extraAttributes = {
  height: 20,
};

const spacerFieldPropsSchema = z.object({
  height: z.number().min(5).max(200),
});

type SpacerFieldInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

export const SpacerFieldElement: FormElement = {
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
    icon: LuSeparatorHorizontal,
    label: "Spacer field",
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
    extraAttributes: { height },
  } = elementInstance as SpacerFieldInstance;

  const { updateElement } = useDesigner();
  const form = useForm<TitleFieldPropsSchemaType>({
    resolver: zodResolver(spacerFieldPropsSchema),
    mode: "onBlur",
    defaultValues: {
      height,
    },
  });

  useEffect(() => {
    form.setFocus("height", { shouldSelect: true });
  }, [elementInstance, form, form.setFocus]);

  useEffect(() => {
    form.reset(elementInstance.extraAttributes);
  }, [form, elementInstance]);

  function applyChanges(values: TitleFieldPropsSchemaType) {
    const { height } = values;
    updateElement(id, {
      ...elementInstance,
      extraAttributes: {
        height,
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
          name="height"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Height {form.watch("height")}px</FormLabel>
                <FormControl className="pt-2">
                  <Slider
                    defaultValue={[field.value]}
                    min={5}
                    max={200}
                    step={1}
                    onValueChange={(value) => {
                      field.onChange(value[0]);
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
    extraAttributes: { height },
  } = elementInstance as SpacerFieldInstance;
  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <Label className="text-muted-foreground">Spacer Field: {height}px</Label>
      <LuSeparatorHorizontal className="h-8 w-8" />
    </div>
  );
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const {
    extraAttributes: { height },
  } = elementInstance as SpacerFieldInstance;

  return <div style={{ height }} className={`w-full`}></div>;
}

type TitleFieldPropsSchemaType = z.infer<typeof spacerFieldPropsSchema>;
