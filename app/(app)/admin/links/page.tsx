import { getLinks } from "@/app/(app)/actions/getLinks";
import Actions from "@/components/admin/Actions";
import SearchableLinksTable from "@/components/admin/SearchableLinksTable";

export default async function LinksPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const { links, total, hasMore, allShortUrls } = await getLinks(
    page,
    10,
    searchParams.search
  );

  return (
    <main className="flex flex-col py-4 h-screen my-4 px-4 w-full">
      <Actions />
      <h1 className="text-2xl font-bold mb-4">Links</h1>
      <SearchableLinksTable
        links={links}
        currentPage={page}
        totalItems={total}
        hasMore={hasMore}
        initialSearch={searchParams.search || ""}
        allShortUrls={allShortUrls}
      />
    </main>
  );
}
