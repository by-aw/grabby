export type UrlLog = {
  track: "true" | "false" | "disabled";
  editUrl: string;
  longUrl: string;
  visits: number;
  visitors: {
    ip: string | null;
    agent: string | null;
    country_name: string | null;
    isp: string | null;
    timestamp: string;
  }[];
};
