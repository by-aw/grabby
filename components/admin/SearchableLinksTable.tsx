"use client";

import { deleteLink } from "@/app/(app)/actions/deleteLink";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { UrlLog } from "@/lib/type";
import { MousePointer, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

type LinksTableProps = {
  links: Record<string, UrlLog>;
  currentPage: number;
  totalItems: number;
  hasMore: boolean;
  initialSearch?: string;
  allShortUrls: string[];
};

const ITEMS_PER_PAGE = 10;

export default function SearchableLinksTable({
  links,
  currentPage,
  totalItems,
  hasMore,
  initialSearch = "",
  allShortUrls,
}: LinksTableProps) {
  const [search, setSearch] = useState(initialSearch);
  const [selectedLinks, setSelectedLinks] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Debounce search updates
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      const currentSearch = params.get("search") || "";

      // Only update if search has changed
      if (search !== currentSearch) {
        if (search) {
          params.set("search", search);
        } else {
          params.delete("search");
        }
        // Only reset page when search changes
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, pathname, router, searchParams]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const handleSelectAll = () => {
    if (selectedLinks.length === allShortUrls.length) {
      setSelectedLinks([]);
    } else {
      setSelectedLinks(allShortUrls);
    }
  };

  const handleSelect = (shortUrl: string) => {
    if (selectedLinks.includes(shortUrl)) {
      setSelectedLinks(selectedLinks.filter((link) => link !== shortUrl));
    } else {
      setSelectedLinks([...selectedLinks, shortUrl]);
    }
  };

  const handleDelete = async () => {
    if (!selectedLinks.length) return;

    try {
      const results = await Promise.all(
        selectedLinks.map((shortUrl) => deleteLink(shortUrl))
      );

      const failures = results.filter((result) => !result.success);

      if (failures.length) {
        toast({
          title: "Error deleting links",
          description: "Some links could not be deleted. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: `Deleted ${selectedLinks.length} link${
            selectedLinks.length === 1 ? "" : "s"
          }`,
        });
        setSelectedLinks([]);
        router.refresh();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete links. Please try again.",
        variant: "destructive",
      });
    }
  };

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set("search", search);
    }
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search links..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        {selectedLinks.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete {selectedLinks.length} selected
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    allShortUrls.length > 0 &&
                    selectedLinks.length === allShortUrls.length
                  }
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Short URL</TableHead>
              <TableHead>Long URL</TableHead>
              <TableHead>Visits</TableHead>
              <TableHead>Tracking</TableHead>
              <TableHead>Edit URL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(links).map(([shortUrl, urlLog]) => (
              <TableRow key={shortUrl}>
                <TableCell>
                  <Checkbox
                    checked={selectedLinks.includes(shortUrl)}
                    onCheckedChange={() => handleSelect(shortUrl)}
                    aria-label={`Select ${shortUrl}`}
                  />
                </TableCell>
                <TableCell>{shortUrl}</TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {urlLog.longUrl}
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <MousePointer className="w-4 h-4" />
                  {urlLog.visits}
                </TableCell>
                <TableCell>{urlLog.track}</TableCell>
                <TableCell>
                  <Link
                    href={`/edit/${urlLog.editUrl}`}
                    className="text-primary hover:underline"
                  >
                    Edit
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={createPageURL(currentPage - 1)}
              aria-disabled={currentPage === 1}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {/* First page */}
          {currentPage > 2 && (
            <PaginationItem>
              <PaginationLink href={createPageURL(1)}>1</PaginationLink>
            </PaginationItem>
          )}

          {/* Ellipsis */}
          {currentPage > 3 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Current page and neighbors */}
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationLink href={createPageURL(currentPage - 1)}>
                {currentPage - 1}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink href={createPageURL(currentPage)} isActive>
              {currentPage}
            </PaginationLink>
          </PaginationItem>

          {hasMore && (
            <PaginationItem>
              <PaginationLink href={createPageURL(currentPage + 1)}>
                {currentPage + 1}
              </PaginationLink>
            </PaginationItem>
          )}

          {/* Ellipsis */}
          {currentPage < totalPages - 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Last page */}
          {currentPage < totalPages - 1 && (
            <PaginationItem>
              <PaginationLink href={createPageURL(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              href={createPageURL(currentPage + 1)}
              aria-disabled={!hasMore}
              className={!hasMore ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
