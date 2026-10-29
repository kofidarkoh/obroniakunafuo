import { MinimalFooter } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { getOrgContact } from "@/lib/data/content";

export default async function ConfirmLayout({ children }: { children: React.ReactNode }) {
  const contact = await getOrgContact();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink"
      >
        Skip to content
      </a>
      <Header contact={contact} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <MinimalFooter contact={contact} />
    </>
  );
}
