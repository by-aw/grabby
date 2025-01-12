import { getUrlLogByEditUrl } from "@/app/(app)/actions/getLink";
import GrabbyLogo from "@/app/assets/logo/grabby.svg";
import AnalyticsDialog from "@/components/dialog/AnalyticsDialog";
import CustomUrlDialog from "@/components/dialog/CustomUrlDialog";
import ExportDialog from "@/components/dialog/ExportDialog";
import BackButton from "@/components/view/BackButton";
import LiveTrafficTable from "@/components/view/LiveTrafficTable";
import { Copy, MousePointer } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const editUrl = params.id;
  if (!/^[a-zA-Z0-9_-]{16}$/.test(editUrl)) {
    notFound();
  }

  const result = await getUrlLogByEditUrl(editUrl);
  if (!result) {
    notFound();
  }

  const { shortUrl, ...urlLog } = result;

  return (
    <main className="flex flex-col items-center w-full mx-auto relative h-screen p-4">
      <header className="flex items-center w-full relative mb-12 max-w-screen-md">
        <BackButton />
        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <GrabbyLogo className="text-brand-primary h-6" />
        </Link>
      </header>
      <section className="flex justify-between gap-4 flex-col sm:flex-row max-w-screen-md w-full">
        <div>
          <a
            href={`/${shortUrl}`}
            className="flex items-center gap-2 mb-1 hover:underline group"
          >
            <h1 className="text-2xl font-bold">{shortUrl}</h1>
            <Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
          </a>
          <h3 className="text-muted-foreground">{urlLog.longUrl}</h3>
        </div>
        <section className="float-right flex gap-2">
          <ExportDialog />
          <AnalyticsDialog shortUrl={shortUrl} urlLog={urlLog} />
          <CustomUrlDialog />
        </section>
      </section>
      <section className="mt-4 mb-12 max-w-screen-md w-full">
        <label>
          <MousePointer className="w-4 h-4 inline mb-1 mr-1" />
          <span>{urlLog.visits}</span>
        </label>
      </section>
      <section className="max-w-screen-md w-full">
        <h2 className="text-xl font-bold mb-4">Live Traffic</h2>
        <LiveTrafficTable shortUrl={shortUrl} urlLog={urlLog} />
      </section>
    </main>
  );
}
