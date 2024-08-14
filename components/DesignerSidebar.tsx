import React from "react";
import { FormElementEnum } from "@/lib/form-builder/types";
import SidebarElementBtn from "./SidebarElementBtn";
import { formElementGroup } from "./FormElement";

function DesignerSidebar() {
  return (
    <aside className="w-[400px] max-w-[400px] flex flex-col flex-grow gap-2 border-l-2 border-muted p-4 bg-background overflow-y-auto h-full">
      UI Components
      <SidebarElementBtn formElement={formElementGroup.TEXT_FIELD} />
    </aside>
  );
}

export default DesignerSidebar;
