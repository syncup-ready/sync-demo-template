type Service = {
  title: string;
  description: string;
  image: string;
};

export default function Services({ services }: { services: Service[] }) {
  return (
    <section className="py-16 px-4 bg-white text-center">
      <h2 className="text-2xl font-bold mb-6">Our Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {services.map((s, i) => (
          <div key={i} className="shadow p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
            <p>{s.description}</p>
            {s.image && (
              <img
                src={s.image}
                className="mt-4 w-full h-64 object-cover rounded-md transition-transform duration-300 transform hover:scale-105 shadow-md"
                alt={s.title}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
