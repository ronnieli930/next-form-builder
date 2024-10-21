import useDesigner from "@/hooks/useDesigner";
import { AiOutlineClose } from "react-icons/ai";
import { formElementGroup } from "./FormElement";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

function SidebarElementPropsGroup() {
  const { selectedElement, setSelectedElement } = useDesigner();

  if (!selectedElement) return null;

  const PropertiesForm = formElementGroup[selectedElement?.type].propsComponent;
  return (
    <div className="flex flex-col p-2">
      <div className="flex justify-between items-center">
        <p className="text-sm text-foreground/70">Field Properties</p>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            setSelectedElement(null);
          }}
        >
          <AiOutlineClose />
        </Button>
      </div>
      <Separator className="mb-4" />
      <PropertiesForm elementInstance={selectedElement} />
    </div>
  );
}

export default SidebarElementPropsGroup;
