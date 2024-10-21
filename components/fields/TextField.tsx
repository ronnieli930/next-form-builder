"use client";
import {
  FormElement,
  FormElementEnum,
  FormElementInstance,
} from "@/lib/form-builder/types";
import { MdTextFields } from "react-icons/md";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Switch } from "../ui/switch";

const type = FormElementEnum.TextField;

const extraAttributes = {
  label: "Text field",
  helperText: "Helper text",
  required: false,
  placeholder: "value here...",
};

const textFieldPropsSchema = z.object({
  label: z.string().min(1).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeholder: z.string().max(50),
});

type TextFieldInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

export const TextFieldElement: FormElement = {
  type: FormElementEnum.TextField,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propsComponent: PropsComponent,
  designerBtnElement: {
    icon: MdTextFields,
    label: "Text field",
  },
};

function PropsComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const {
    id,
    extraAttributes: { label, required, placeholder, helperText },
  } = elementInstance as TextFieldInstance;

  const { updateElement } = useDesigner();
  const form = useForm<TextFieldPropsSchemaType>({
    resolver: zodResolver(textFieldPropsSchema),
    mode: "onBlur",
    defaultValues: {
      label,
      helperText,
      required,
      placeholder,
    },
  });

  useEffect(() => {
    form.setFocus("label", { shouldSelect: true });
  }, [elementInstance, form, form.setFocus]);

  useEffect(() => {
    form.reset(elementInstance.extraAttributes);
  }, [form, elementInstance]);

  function applyChanges(values: TextFieldPropsSchemaType) {
    const { label, helperText, placeholder, required } = values;
    updateElement(id, {
      ...elementInstance,
      extraAttributes: {
        label,
        helperText,
        placeholder,
        required,
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
          name="label"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.currentTarget.blur();
                    }}
                  />
                </FormControl>
                <FormDescription>The Label of the Text field.</FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="placeholder"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Placeholder</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    required={false}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.currentTarget.blur();
                    }}
                  />
                </FormControl>
                <FormDescription>
                  The Placeholder of the Text field.
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="helperText"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Helper text</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.currentTarget.blur();
                    }}
                  />
                </FormControl>
                <FormDescription>
                  The Helper text of the Text field.
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="required"
          render={({ field }) => {
            return (
              <FormItem className="flex items-center justify-between rounded-md border p-3 shadow-sm">
                <div className="space-y-0 5">
                  <FormLabel>Required</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
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
    extraAttributes: { label, required, placeholder, helperText },
  } = elementInstance as TextFieldInstance;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <Input readOnly disabled placeholder={placeholder} />
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}
    </div>
  );
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const {
    extraAttributes: { label, required, placeholder, helperText },
  } = elementInstance as TextFieldInstance;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <Input readOnly disabled placeholder={placeholder} />
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}
    </div>
  );
}

type TextFieldPropsSchemaType = z.infer<typeof textFieldPropsSchema>;
