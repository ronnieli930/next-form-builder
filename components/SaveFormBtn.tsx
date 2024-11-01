import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { HiSaveAs } from "react-icons/hi";
import useDesigner from "@/hooks/useDesigner";
import { toast } from "./ui/use-toast";
import { FaSpinner } from "react-icons/fa";
import { updateFormContent } from "@/actions/form";

function SaveFormButton({ id }: { id: number }) {
  const { elements } = useDesigner();
  const [loading, startTransition] = useTransition();

  const handleUpdateForm = async () => {
    try {
      const elementJSON = JSON.stringify(elements);
      await updateFormContent(id, elementJSON);
      toast({
        title: "Success",
        description: "Your form saved succcessfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Your form cannot be saved ",
        variant: "destructive",
      });
    }
  };
  return (
    <Button
      variant="outline"
      className="gap-2"
      disabled={loading}
      onClick={() => {
        startTransition(handleUpdateForm);
      }}
    >
      <HiSaveAs className="h-4 w-4" />
      Save
      {loading && <FaSpinner className="animate-spin" />}
    </Button>
  );
}

export default SaveFormButton;
