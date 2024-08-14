"use client";
import { FormElementEnum, FormElement } from "@/lib/form-builder/types";
import { MdTextFields } from "react-icons/md";

const type = FormElementEnum.TextField;

export const TextFieldElement: FormElement = {
  type: FormElementEnum.TextField,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes: {
      label: "Text field",
      helperText: "Helper text",
      required: false,
      placeHolder: "value here...",
    },
  }),
  designerComponent: () => <div>designer Component</div>,
  formComponent: () => <div>form Component</div>,
  propsComponent: () => <div>props Component</div>,
  designerBtnElement: {
    icon: MdTextFields,
    label: "Text field",
  },
};

function TextField() {
  return <div>TextField</div>;
}

export default TextField;
