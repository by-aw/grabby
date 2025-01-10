export type UrlLog = {
  track: "true" | "false" | "disabled";
  editUrl: string;
  longUrl: string;
  visits: number;
  visitors: {
    ip: string | undefined;
    agent: string | undefined;
    country_name: string | undefined;
    isp: string | undefined;
    timestamp: string;
  }[];
};
