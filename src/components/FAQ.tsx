type FAQItem = {
    question: string;
    answer: string;
  };
  
  export default function FAQ({ faqs }: { faqs: FAQItem[] }) {
    return (
      <section className="py-16 px-4 bg-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b pb-4">
              <h3 className="font-semibold text-lg">{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }
  