import { Package, FileText, IndianRupee } from 'lucide-react';

export function FaqSection() {
  const faqs = [
    {
      icon: <IndianRupee size={16} />,
      question: 'What are the fees?',
      answer:
        'We charge a flat 10% commission only when your item sells. No listing fees.',
    },
    {
      icon: <Package size={16} />,
      question: 'How does shipping work?',
      answer:
        'You ship to our hub using a provided prepaid label. We handle delivery to the buyer.',
    },
    {
      icon: <FileText size={16} />,
      question: 'What can I sell?',
      answer:
        'We accept luxury watches, sneakers, handbags, and collectibles valued over ₹500.',
    },
  ];

  return (
    <div className="mt-16 border-t border-border pt-12">
      <h3 className="text-2xl font-semibold mb-8 text-center text-foreground">
        Common Questions
      </h3>
      <div className="grid md:grid-cols-3 gap-6">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-border"
          >
            <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
              {faq.icon} {faq.question}
            </h4>
            <p className="text-sm text-muted-foreground">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
