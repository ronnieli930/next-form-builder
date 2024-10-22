import React from "react";
import SidebarElementBtn from "./SidebarElementBtn";
import { formElementGroup } from "./FormElement";
import { Separator } from "./ui/separator";

function SidebarElementBtnGroup() {
  return (
    <>
      <p className="text-sm text-foreground/70"> Drag and drop elements</p>
      <Separator className="my-2" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 place-items-center">
        <p className="text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start">
          Layout Elements
        </p>
        <SidebarElementBtn formElement={formElementGroup.TITLE_FIELD} />
        <SidebarElementBtn formElement={formElementGroup.SUBTITLE_FIELD} />
        <SidebarElementBtn formElement={formElementGroup.PARAGRAPH_FIELD} />

        <p className="text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start">
          Form Elements
        </p>
        <SidebarElementBtn formElement={formElementGroup.TEXT_FIELD} />
      </div>
    </>
  );
}

export default SidebarElementBtnGroup;
