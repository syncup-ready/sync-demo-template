type Testimonial = {
    name: string;
    quote: string;
  };
  
  export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
    return (
      <section className="bg-gray-100 py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-6">What Our Clients Say</h2>
        <div className="max-w-2xl mx-auto">
          {testimonials.map((t, i) => (
            <blockquote key={i} className="italic mb-4">“{t.quote}” — <strong>{t.name}</strong></blockquote>
          ))}
        </div>
      </section>
    );
  }
  