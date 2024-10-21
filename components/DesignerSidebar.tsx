import useDesigner from "@/hooks/useDesigner";
import SidebarElementBtnGroup from "./SidebarElementBtnGroup";
import SidebarElementAttributeGroup from "./SidebarElementPropsGroup";
import { Separator } from "./ui/separator";

function DesignerSidebar() {
  const { selectedElement } = useDesigner();

  return (
    <aside className="w-[400px] max-w-[400px] flex flex-col flex-grow gap-2 border-l-2 border-muted p-4 bg-background overflow-y-auto h-full">
      {!selectedElement && <SidebarElementBtnGroup />}
      {selectedElement && <SidebarElementAttributeGroup />}
    </aside>
  );
}

export default DesignerSidebar;
