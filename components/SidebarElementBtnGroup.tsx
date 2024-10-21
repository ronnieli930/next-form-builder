import React from "react";
import SidebarElementBtn from "./SidebarElementBtn";
import { formElementGroup } from "./FormElement";

function SidebarElementBtnGroup() {
  return (
    <>
      UI Components
      <SidebarElementBtn formElement={formElementGroup.TEXT_FIELD} />
    </>
  );
}

export default SidebarElementBtnGroup;
