import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AdSenseLoader } from "@/components/ads/adsense-loader";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdSenseLoader />
      <PageViewTracker />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
