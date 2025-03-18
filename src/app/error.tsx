"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="text-gray-500">
        {error.message || "An unexpected error occurred."}
      </p>
      <Button onClick={() => reset()}>Try Again</Button>
    </div>
  );
}
