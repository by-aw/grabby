"use client";

import { setTracking } from "@/app/actions/setTracking";
import { UrlLog } from "@/lib/type";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Switch } from "../ui/switch";

interface AnalyticsDialogProps {
  urlLog: UrlLog;
  shortUrl: string;
}

function getTotalVisits(urlLog: UrlLog): number {
  return urlLog.visits;
}

function getTotalUniqueVisitors(urlLog: UrlLog): number {
  const uniqueIps = new Set(urlLog.visitors.map((visitor) => visitor.ip));
  return uniqueIps.size;
}

function getTotalCountries(urlLog: UrlLog): number {
  const uniqueCountries = new Set(
    urlLog.visitors.map((visitor) => visitor.country_name).filter(Boolean)
  );
  return uniqueCountries.size;
}

function getTotalDevices(urlLog: UrlLog): number {
  const uniqueDevices = new Set(
    urlLog.visitors.map((visitor) => visitor.agent).filter(Boolean)
  );
  return uniqueDevices.size;
}

export default function AnalyticsDialog({
  urlLog,
  shortUrl,
}: AnalyticsDialogProps) {
  const totalVisits = getTotalVisits(urlLog);
  const uniqueVisitors = getTotalUniqueVisitors(urlLog);
  const totalCountries = getTotalCountries(urlLog);
  const totalDevices = getTotalDevices(urlLog);
  const [isLoading, setIsLoading] = useState(false);
  const [track, setTrack] = useState(urlLog.track === "true");
  useEffect(() => {
    setIsLoading(true);
    const handler = setTimeout(async () => {
      await setTracking(shortUrl, urlLog, track ? "true" : "false");
      setIsLoading(false);
    }, 2000); // Adjust the debounce delay as needed

    return () => {
      clearTimeout(handler);
      setIsLoading(false);
    };
  }, [track]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="rounded-full w-full sm:w-auto">
          Analytics
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl">
        <DialogTitle>Analytics</DialogTitle>
        <DialogDescription>View your link analytics</DialogDescription>

        <div className="flex items-center justify-between gap-4 p-4 border border-border rounded-lg">
          <div>
            <h2>Log Traffic</h2>
            <p className="text-muted-foreground">
              Track the traffic of your link.
            </p>
          </div>
          <Switch
            disabled={isLoading}
            onCheckedChange={(checked) => {
              setTrack(checked);
            }}
            checked={track}
          />
        </div>

        <div className="flex flex-col gap-4 p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-muted-foreground">Total Visits</h2>
            <span className="text-xl font-bold">{totalVisits}</span>
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-muted-foreground">Unique Visitors</h2>
            <span className="text-xl font-bold">{uniqueVisitors}</span>
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-muted-foreground">Countries Reached</h2>
            <span className="text-xl font-bold">{totalCountries}</span>
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-muted-foreground">Different Devices</h2>
            <span className="text-xl font-bold">{totalDevices}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
