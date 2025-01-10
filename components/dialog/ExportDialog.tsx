import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function ExportDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="rounded-full w-full sm:w-auto">
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl">
        <DialogTitle>Export</DialogTitle>
        <DialogDescription>Export has yet to be implemented</DialogDescription>
        <DialogFooter>
          <DialogClose>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
