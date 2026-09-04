import { siteConfig } from "@/config/site";
import type { ConversionDefinition, FaqItem } from "@/config/conversions";
import type { FormatDefinition } from "@/config/formats";

export function buildWebApplicationJsonLd(conversion: ConversionDefinition, title: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: title,
    description,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any (runs in web browser)",
    url: `${siteConfig.url}/${conversion.slug}`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export function buildFaqJsonLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

export function buildFormatArticleJsonLd(format: FormatDefinition) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${format.fullName} (.${format.extensions[0].replace(".", "")}) — Format Guide`,
    description: format.description,
    url: `${siteConfig.url}/formats/${format.id}`,
  };
}
