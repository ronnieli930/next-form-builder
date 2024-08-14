import React from "react";
import { Button } from "./ui/button";
import { MdPreview } from "react-icons/md";

function PreviewDialogBtn() {
  return (
    <Button variant="outline" className="gap-2">
      <MdPreview className="h-4 w-4" />
      Preview
    </Button>
  );
}

export default PreviewDialogBtn;
