"use client";

import TrafficEmptyIllustration from "@/app/assets/illustrations/traffic-empty.svg";
import { UrlLog } from "@/lib/type";
import { cn, getOSFromUserAgent } from "@/lib/utils";
import { useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function LiveTrafficTable({
  shortUrl,
  urlLog,
}: {
  shortUrl: string;
  urlLog: UrlLog;
}) {
  const [isOpen, setIsOpen] = useState(false);

  async function handleShare() {
    await navigator.clipboard.writeText(
      `${window.location.origin}/${shortUrl}`
    );
    setIsOpen(true);
    setTimeout(() => setIsOpen(false), 2000);
  }

  if (urlLog.visitors.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center h-full">
        <TrafficEmptyIllustration className="w-64 h-64" />
        <h2 className="text-xl font-bold mb-4">No traffic — yet</h2>
        <p className="text-muted-foreground">
          Share your smart link to get going.
        </p>
        <Popover open={isOpen}>
          <PopoverTrigger asChild>
            <Button
              onClick={handleShare}
              disabled={isOpen}
              className={cn(
                "mt-4 rounded-full transition-colors",
                isOpen && "blur-sm"
              )}
            >
              Share
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" align="center" className="w-fit px-4 py-2">
            <p className="text-sm">Copied!</p>
          </PopoverContent>
        </Popover>
      </section>
    );
  }
  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Device</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {urlLog.visitors.map((visitor) => (
            <TableRow key={visitor.timestamp}>
              <TableCell>
                {new Date(Number(visitor.timestamp)).toLocaleString()}
              </TableCell>
              <TableCell>{visitor.ip ?? "N/A"}</TableCell>
              <TableCell>
                {getOSFromUserAgent(visitor.agent) ?? "N/A"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
