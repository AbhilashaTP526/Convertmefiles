import type { FaqItem } from "@/config/conversions";

export function FaqSection({ faqs }: { faqs: FaqItem[] }) {
  return (
    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-xl font-bold text-zinc-900">
        Frequently Asked Questions
      </h2>
      <dl className="mt-4 divide-y divide-zinc-200 rounded-lg border border-zinc-200">
        {faqs.map((faq) => (
          <div key={faq.question} className="p-4">
            <dt className="font-semibold text-zinc-900">{faq.question}</dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-zinc-600">{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
