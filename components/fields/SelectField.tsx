"use client";
import {
  FormElement,
  FormElementEnum,
  FormElementInstance,
  SubmitFnType,
} from "@/lib/form-builder/types";
import { RxDropdownMenu } from "react-icons/rx";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { toast } from "../ui/use-toast";

const type = FormElementEnum.SelectField;

const extraAttributes = {
  label: "Select field",
  helperText: "Helper text",
  required: false,
  placeholder: "value here...",
  options: [],
};

const selectFieldPropsSchema = z.object({
  label: z.string().min(1).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeholder: z.string().max(50),
  options: z.array(z.string()).default([]),
});

type SelectFieldInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

export const SelectFieldElement: FormElement = {
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
    icon: RxDropdownMenu,
    label: "Select field",
  },
  validate: (formEl: FormElementInstance, currentValue: string): boolean => {
    console.log("currentValue", currentValue);
    const {
      extraAttributes: { required },
    } = formEl as SelectFieldInstance;

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
    extraAttributes: { label, required, placeholder, helperText, options },
  } = elementInstance as SelectFieldInstance;

  const { updateElement, setSelectedElement } = useDesigner();
  const form = useForm<SelectFieldPropsSchemaType>({
    resolver: zodResolver(selectFieldPropsSchema),
    mode: "onSubmit",
    defaultValues: {
      label,
      helperText,
      required,
      placeholder,
      options,
    },
  });

  useEffect(() => {
    form.setFocus("label", { shouldSelect: true });
  }, [elementInstance, form, form.setFocus]);

  useEffect(() => {
    form.reset(elementInstance.extraAttributes);
  }, [form, elementInstance]);

  function applyChanges(values: SelectFieldPropsSchemaType) {
    const { label, helperText, placeholder, required, options } = values;
    updateElement(id, {
      ...elementInstance,
      extraAttributes: {
        label,
        helperText,
        placeholder,
        required,
        options,
      },
    });

    toast({
      title: "Success",
      description: "Properties saved successfully",
    });

    setSelectedElement(null);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(applyChanges)} className="space-y-4">
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
                  The Label of the Select field.
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
                  The Placeholder of the Select field.
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
                  The Helper text of the Select field.
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <Separator />
        <FormField
          control={form.control}
          name="options"
          render={({ field }) => {
            return (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Options</FormLabel>
                  <Button
                    variant={"outline"}
                    className="gap-2"
                    onClick={(e) => {
                      e.preventDefault(); // avoid submit
                      form.setValue(
                        "options",
                        field.value.concat("New Option"),
                      );
                    }}
                  >
                    <AiOutlinePlus />
                    Add
                  </Button>
                </div>

                <div className="flex flex-col gap-2">
                  {form.watch("options").map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-1"
                    >
                      <Input
                        placeholder=""
                        value={option}
                        onChange={(e) => {
                          console.log(1111, field.value);
                          field.value[index] = e.target.value;
                          field.onChange(field.value);
                        }}
                      />
                      <Button
                        variant={"ghost"}
                        size={"icon"}
                        onClick={(e) => {
                          e.preventDefault();
                          const newOptions = [...field.value];
                          newOptions.splice(index, 1);
                          field.onChange(newOptions);
                        }}
                      >
                        <AiOutlineClose />
                      </Button>
                    </div>
                  ))}
                </div>

                <FormDescription>
                  The Helper text of the Select field.
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Separator />

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
        <Separator />
        <Button type="submit" className="w-full">
          Save
        </Button>
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
  } = elementInstance as SelectFieldInstance;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </Select>
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
    extraAttributes: { label, required, placeholder, helperText, options },
  } = elementInstance as SelectFieldInstance;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(hasError && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>
      <Select
        defaultValue={value}
        onValueChange={(value) => {
          setValue(value);
          if (!submitFn) return;
          const valid = SelectFieldElement.validate(elementInstance, value);
          setHasError(!valid);
          submitFn(elementInstance.id, value);
        }}
      >
        <SelectTrigger className={cn("w-full", hasError && "border-red-500")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((op) => (
            <SelectItem key={op} value={op}>
              {op}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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

type SelectFieldPropsSchemaType = z.infer<typeof selectFieldPropsSchema>;
