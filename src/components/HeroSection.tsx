type HeroSectionProps = {
    headline: string;
    subheadline: string;
    cta: string;
    image: string;
  };
  
  export default function HeroSection({ headline, subheadline, cta, image }: HeroSectionProps) {
    return (
      <section className="text-center py-20 bg-gray-900 text-white" style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover' }}>
        <h1 className="text-4xl font-bold mb-4">{headline}</h1>
        <p className="mb-6">{subheadline}</p>
        <button className="bg-yellow-400 text-black px-6 py-2 rounded">{cta}</button>
      </section>
    );
  }
  