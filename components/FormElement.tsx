import {
  FormElementGroupType,
  FormElementEnum,
} from "@/lib/form-builder/types";
import { TextFieldElement } from "./fields/TextField";

export const formElementGroup: FormElementGroupType = {
  [FormElementEnum.TextField]: TextFieldElement,
};
