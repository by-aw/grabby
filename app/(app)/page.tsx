import GrabbyLogo from "@/app/assets/logo/grabby.svg";
import CreateLinkForm from "@/components/home/CreateLinkForm";
import Footer from "@/components/home/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center relative w-screen h-screen px-4">
      <section className="flex-1 flex flex-col justify-end shrink-0 sticky top-0 max-w-screen-md bg-gradient-to-b from-background to-transparent from-95% z-50 py-12 w-full">
        <header className="flex flex-col items-center justify-center w-full">
          <GrabbyLogo className="mb-4 w-28 text-brand-primary" />
          <h1 className="text-3xl font-bold mb-8 text-center">
            Create smart short links, easily.
          </h1>
        </header>
        <CreateLinkForm />
        <label className="text-sm font-light text-center text-muted-foreground mt-4">
          By clicking create, you accept our{" "}
          <Link href="/terms">Terms of Service</Link> and{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </label>
      </section>
      <section className="flex w-full h-1/3 max-w-screen-md">
        <Footer />
      </section>
    </main>
  );
}
