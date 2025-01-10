"use client";

import { deleteAllLinks } from "@/app/(app)/actions/deleteLink";
import { Button } from "../ui/button";

export default function Actions() {
  async function handleDeleteAll() {
    await deleteAllLinks();
  }

  return (
    <div className="flex flex-col gap-2 w-full mb-4">
      <h2 className="text-sm font-bold uppercase mb-2 opacity-50">Actions</h2>
      <div className="flex gap-2 mb-4">
        <Button variant="destructive" onClick={handleDeleteAll}>
          Delete all
        </Button>
      </div>
    </div>
  );
}
