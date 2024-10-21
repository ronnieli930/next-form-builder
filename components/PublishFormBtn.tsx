import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { MdOutlinePublish } from "react-icons/md";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FaIcons } from "react-icons/fa";
import { toast } from "./ui/use-toast";
import { publishForm } from "@/actions/form";
import { useRouter } from "next/navigation";

function PublishFormBtn({ id }: { id: number }) {
  const [loading, startTransition] = useTransition();

  const router = useRouter();

  async function handlePublishForm() {
    try {
      await publishForm(id);
      toast({
        title: "Success",
        description: "you form is now available to the public",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Error happened",
        variant: "destructive",
      });
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 text-white bg-gradient-to-r from-indigo-400 to-cyan-400"
        >
          <MdOutlinePublish className="h-4 w-4" />
          Publish
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This cannot be undo. After publishing you cannot edit this form{" "}
            <br />
            <br />
            <span className="font-medium">
              publishing it, you can collect submissions
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              startTransition(handlePublishForm);
            }}
          >
            Procees
            {loading && <FaIcons className="animate-spin" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default PublishFormBtn;
