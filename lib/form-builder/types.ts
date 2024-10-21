export enum FormElementEnum {
  TextField = "TEXT_FIELD",
}

export type FormElementInstance = {
  id: string;
  type: FormElementEnum;
  extraAttributes?: Record<string, any>;
};

export type FormElement = {
  construct: (id: string) => FormElementInstance;

  type: FormElementEnum;
  designerBtnElement: {
    icon: React.ElementType;
    label: string;
  };

  designerComponent: React.FC<{
    elementInstance: FormElementInstance;
  }>;
  formComponent: React.FC<{
    elementInstance: FormElementInstance;
  }>;
  propsComponent: React.FC<{
    elementInstance: FormElementInstance;
  }>;
};

export type FormElementGroupType = {
  [key in FormElementEnum]: FormElement;
};
