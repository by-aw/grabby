import { Toaster } from "@/components/ui/toaster";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col items-center justify-center w-screen h-screen overflow-x-hidden">
      {children}
      <Toaster />
    </section>
  );
}
