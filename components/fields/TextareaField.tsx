"use client";
import {
  FormElement,
  FormElementEnum,
  FormElementInstance,
  SubmitFnType,
} from "@/lib/form-builder/types";
import { MdTextFields } from "react-icons/md";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import useDesigner from "@/hooks/useDesigner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
import { cn } from "@/lib/utils";
import { BsTextareaResize } from "react-icons/bs";
import { Textarea } from "../ui/textarea";
import { Slider } from "../ui/slider";

const type = FormElementEnum.TextareaField;

const extraAttributes = {
  label: "Textarea field",
  helperText: "Helper text",
  required: false,
  placeholder: "value here...",
  rows: 3,
};

const textareaFieldPropsSchema = z.object({
  label: z.string().min(1).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeholder: z.string().max(50),
  rows: z.number().min(2).max(10),
});

type TextareaFieldInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

export const TextareaFieldElement: FormElement = {
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
    icon: BsTextareaResize,
    label: "Textarea field",
  },
  validate: (formEl: FormElementInstance, currentValue: string): boolean => {
    console.log("currentValue", currentValue);
    const {
      extraAttributes: { required },
    } = formEl as TextareaFieldInstance;

    if (required) {
      return currentValue.length > 0;
    }

    return true;
  },
};

function PropsComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const {
    id,
    extraAttributes: { label, required, placeholder, helperText, rows },
  } = elementInstance as TextareaFieldInstance;

  const { updateElement } = useDesigner();
  const form = useForm<TextareaFieldPropsSchemaType>({
    resolver: zodResolver(textareaFieldPropsSchema),
    mode: "onBlur",
    defaultValues: {
      label,
      helperText,
      required,
      placeholder,
      rows,
    },
  });

  useEffect(() => {
    form.setFocus("label", { shouldSelect: true });
  }, [elementInstance, form, form.setFocus]);

  useEffect(() => {
    form.reset(elementInstance.extraAttributes);
  }, [form, elementInstance]);

  function applyChanges(values: TextareaFieldPropsSchemaType) {
    const { label, helperText, placeholder, required, rows } = values;
    updateElement(id, {
      ...elementInstance,
      extraAttributes: {
        label,
        helperText,
        placeholder,
        required,
        rows,
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
                <FormDescription>
                  The Label of the Textarea field.
                </FormDescription>
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
                  The Placeholder of the Textarea field.
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
                  The Helper text of the Textarea field.
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

        <FormField
          control={form.control}
          name="rows"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Rows {form.watch("rows")}</FormLabel>
                <FormControl>
                  <Slider
                    defaultValue={[field.value]}
                    min={2}
                    max={10}
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
    extraAttributes: { label, required, placeholder, helperText },
  } = elementInstance as TextareaFieldInstance;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <Textarea readOnly disabled placeholder={placeholder} />
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}
    </div>
  );
}

function FormComponent({
  elementInstance,
  submitFn,
  isValid,
  defaultValue = "",
}: {
  elementInstance: FormElementInstance;
  submitFn?: SubmitFnType;
  isValid?: boolean;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(isValid === false); // can be undefined ...
  }, [isValid]);

  const {
    extraAttributes: { label, required, placeholder, helperText, rows },
  } = elementInstance as TextareaFieldInstance;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(hasError && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>
      <Textarea
        rows={rows}
        className={cn(hasError && "border-red-500")}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => {
          if (!submitFn) return;
          const valid = TextareaFieldElement.validate(
            elementInstance,
            e.target.value,
          );

          console.log("valid", valid);

          setHasError(!valid);
          if (!valid) return;
          submitFn(elementInstance.id, e.target.value);
        }}
        value={value}
      />
      {helperText && (
        <p
          className={cn(
            "text-muted-foreground text-[0.8rem]",
            hasError && "text-red-500",
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

type TextareaFieldPropsSchemaType = z.infer<typeof textareaFieldPropsSchema>;
