"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect } from "react";

function ErrorPage({ error }: { error: Error }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center flex-col w-full h-full">
      404 Error Page
      <Button variant="secondary" asChild>
        <Link href="/">Go back to home</Link>
      </Button>
    </div>
  );
}

export default ErrorPage;
