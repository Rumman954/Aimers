import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col pt-16">{children}</div>
      <Footer />
    </>
  );
}
