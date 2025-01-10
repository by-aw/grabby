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

export default function CustomUrlDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="rounded-full w-full sm:w-auto">
          Custom URL
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl">
        <DialogTitle>Custom URL</DialogTitle>
        <DialogDescription>
          Custom URL's have yet to be implemented
        </DialogDescription>
        <DialogFooter>
          <DialogClose>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
