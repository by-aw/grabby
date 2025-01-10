"use client";

import createLink from "@/app/actions/createLinkAction";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import useLocalStorage from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";
import { ClipboardIcon, ScissorsIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

function PasteButton({
  className,
  setLink,
}: {
  className?: string;
  setLink: (link: string) => void;
}) {
  function handlePaste() {
    const clipboard = navigator.clipboard;
    clipboard.readText().then((text) => {
      setLink(text);
    });
  }
  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <Button
          variant={"ghost"}
          size="icon"
          type="button"
          onClick={handlePaste}
          className={cn(
            "rounded-full w-12 h-12 hover:bg-foreground/10",
            className
          )}
        >
          <ClipboardIcon className="w-6 h-6" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Paste from clipboard</p>
      </TooltipContent>
    </Tooltip>
  );
}

function ShortenButton({ className }: { className?: string }) {
  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          type="submit"
          className={cn("rounded-full w-12 h-12", className)}
        >
          <ScissorsIcon className="w-6 h-6" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Shorten URL</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default function CreateLinkForm() {
  const router = useRouter();
  const [link, setLink] = useState("");
  const [savedLinks, setSavedLinks] = useLocalStorage<string[]>("links", []);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    if (!link || !/.+\..{2,}$/.test(link) || link.length < 3) {
      setIsError(true);
      setTimeout(() => setIsError(false), 500);
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL.",
        variant: "destructive",
      });
      return;
    }

    const { success, message, shortUrl, editUrl } = await createLink(formData);
    if (shortUrl && editUrl) {
      setSavedLinks([...savedLinks, shortUrl]);
      router.push(`/edit/${editUrl}`);
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 500);
      toast({
        title: "Error creating short link",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        `flex items-center gap-1 justify-center bg-secondary rounded-full h-16 w-full pr-2 transition-all overflow-hidden ring-0 ring-primary/50 has-[:focus-visible]:ring-2`,
        isError && "shake-animation bg-destructive"
      )}
    >
      <input
        name="link"
        type="text"
        value={link}
        autoFocus
        onChange={(e) => setLink(e.target.value)}
        placeholder="Enter your link"
        className={cn(
          "bg-transparent text-base border-none outline-none flex-1 h-full pl-4 py-3",
          isError &&
            "placeholder-[hsl(var(--destructive-foreground))] text-[hsl(var(--destructive-foreground))]"
        )}
      />
      <TooltipProvider>
        <PasteButton
          setLink={setLink}
          className={cn(
            isError &&
              "bg-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))]"
          )}
        />
        <ShortenButton
          className={cn(
            isError &&
              "bg-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))]"
          )}
        />
      </TooltipProvider>
    </form>
  );
}
