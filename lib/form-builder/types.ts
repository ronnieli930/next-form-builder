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

  designerComponent: React.FC;
  formComponent: React.FC;
  propsComponent: React.FC;
};

export type FormElementGroupType = {
  [key in FormElementEnum]: FormElement;
};
