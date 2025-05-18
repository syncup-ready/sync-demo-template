import { GetStaticPaths, GetStaticProps } from 'next';
import { supabase } from '@/lib/supabaseClient';
import Head from 'next/head';
import Image from 'next/image';
import React from 'react';

// Define a more specific type for business data
interface BusinessData {
  logo_text?: string | null;
  business_name?: string | null;
  city?: string | null;
  state?: string | null;
  description?: string | null;
  footer_description?: string | null; 
  category?: string | null;

  about_us_image_1?: string | null; // Unsplash query keyword
  about_us_image_2?: string | null; // Unsplash query keyword
  about_us_image_3?: string | null; // Unsplash query keyword

  resolved_hero_image?: string | null;
  hero_major_headline?: string | null;
  hero_minor_headline?: string | null;
  hero_cta_text?: string | null;
  phone?: string | null;
  call_to_action_on_buttons?: string | null; // Legacy
  hero_headline?: string | null; // Legacy

  banner_headline?: string | null;
  banner_cta_button_text?: string | null;

  about_us_small_title?: string | null;
  about_us_headline?: string | null;
  about_us_main_paragraph?: string | null;
  resolved_about_us_image?: string | null;

  services_section_title?: string | null;
  service_1?: string | null;
  service_2?: string | null;
  service_3?: string | null;
  service_4?: string | null;
  service_5?: string | null;
  resolved_service_1_image?: string | null;
  resolved_service_2_image?: string | null;
  resolved_service_3_image?: string | null;
  resolved_service_4_image?: string | null;
  resolved_service_5_image?: string | null;
  paragraph_for_service_1?: string | null;
  paragraph_for_service_2?: string | null;
  paragraph_for_service_3?: string | null;
  paragraph_for_service_4?: string | null;
  paragraph_for_service_5?: string | null;

  testimonials_section_title?: string | null;
  // Assuming testimonials are hardcoded or fetched differently

  faq_section_title?: string | null;
  question_1?: string | null; answer_1?: string | null;
  question_2?: string | null; answer_2?: string | null;
  question_3?: string | null; answer_3?: string | null;
  question_4?: string | null; answer_4?: string | null;
  question_5?: string | null; answer_5?: string | null;
  question_6?: string | null; answer_6?: string | null;
  question_7?: string | null; answer_7?: string | null;
  question_8?: string | null; answer_8?: string | null;
  question_9?: string | null; answer_9?: string | null;
  question_10?: string | null; answer_10?: string | null;

  contact_section_title?: string | null;
  email?: string | null;
  full_address?: string | null;
  contact_additional_info?: string | null;
  // Add any other fields from your Supabase table that are used
}

const SectionWrapper = ({ children, className = '', ...props }: React.PropsWithChildren<{ className?: string } & React.HTMLAttributes<HTMLElement>>) => (
  <section className={`max-w-6xl mx-auto px-4 py-12 md:py-16 ${className}`} {...props}>
    {children}
  </section>
);

const fetchUnsplashImage = async (query: string): Promise<string | null> => {
  if (!query) return null;
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&per_page=1&client_id=AL4tODD2Eh-vk9XariMmCOH52VbRQRVdGkVLnnbpUTI`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error("Unsplash API error:", res.status, await res.text());
      return null;
    }
    const json = await res.json();
    // Ensure you handle the case where results might be empty or structure is different
    return json?.results?.[0]?.urls?.regular || null;
  } catch (err) {
    console.error("Unsplash fetch error:", err);
    return null;
  }
};

type BusinessPageProps = {
  business: BusinessData | null; // Use the defined interface
};

export const getStaticProps: GetStaticProps<BusinessPageProps, { slug: string }> = async ({ params }) => {
  const slug = params?.slug;
  if (!slug) {
    return { notFound: true };
  }

  const { data, error } = await supabase
    .from('businesses_metadata')
    .select('*')
    .eq('slug', slug)
    .single<BusinessData>(); // Add type to single()

  if (error || !data) {
    console.error('Supabase fetch error or no data:', error?.message);
    return { notFound: true }; // Ensure notFound is returned if no data
  }

  const heroImageQuery = data?.about_us_image_1 || 'modern roofing';
  console.log('[getStaticProps] Hero Image Query:', heroImageQuery);
  const heroImage = await fetchUnsplashImage(heroImageQuery);
  console.log('[getStaticProps] Fetched Hero Image URL:', heroImage);

  const aboutUsImageQuery = data?.about_us_image_2 || 'construction team';
  const aboutUsImage = await fetchUnsplashImage(aboutUsImageQuery);
  
  const serviceImageKeys: (keyof BusinessData)[] = ['service_1', 'service_2', 'service_3', 'service_4', 'service_5'];
  const serviceImages = await Promise.all(
    serviceImageKeys.map(key => fetchUnsplashImage(data?.[key] as string || `service ${key.slice(-1)}`))
  );

  const enrichedData: BusinessData = {
    ...data,
    resolved_hero_image: heroImage,
    resolved_about_us_image: aboutUsImage,
    resolved_service_1_image: serviceImages[0],
    resolved_service_2_image: serviceImages[1],
    resolved_service_3_image: serviceImages[2],
    resolved_service_4_image: serviceImages[3],
    resolved_service_5_image: serviceImages[4],
  };

  return { props: { business: enrichedData }, revalidate: 60 };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await supabase.from('businesses_metadata').select('slug');
  const paths = (data || []).map((b: { slug: string }) => ({ params: { slug: b.slug } }));
  return { paths, fallback: 'blocking' };
};

export default function BusinessPage({ business }: BusinessPageProps) {
  if (!business) return <p>Loading business data or not found...</p>; 

  console.log('[BusinessPage] business.resolved_hero_image:', business?.resolved_hero_image);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about-us', label: 'About' },
    { href: '#services', label: 'Services' },
    { href: '#faq', label: 'FAQ\'s' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#contact-us', label: 'Contact Us' },
  ];

  const servicesForFooter = [
    business.service_1,
    business.service_2,
    business.service_3,
    business.service_4,
    business.service_5,
  ].filter(Boolean);

  return (
    <main className="bg-white text-gray-800 font-sans">
      <Head>
        <title>{`${business.business_name || 'Trustworthy Roofing'} | ${business.city || 'Demo (Test)'}`}</title>
        <meta name="description" content={business.description || business.hero_headline || 'Get a FREE Quote for your roofing needs.'} />
      </Head>

      <header id="home" className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="font-bold text-xl text-red-600">{business.logo_text || 'LOGO HERE'}</span>
          </div>
          <nav className="hidden md:flex space-x-1">
            {navLinks.map(link => (
              <a key={link.label} href={link.href} className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <div 
        id="home-hero-section" // Changed id to avoid conflict with header
        className="relative h-[70vh] min-h-[400px] flex flex-col items-center justify-center text-white text-center bg-gray-700 scroll-mt-16"
      >
        {business.resolved_hero_image && (
          <Image
            src={business.resolved_hero_image}
            alt={business.hero_major_headline || "Hero background"}
            fill={true}
            style={{objectFit: 'cover'}}
            className="opacity-50 z-0"
            priority // Good for LCP
          />
        )}
        {!business.resolved_hero_image && (
          <div className="absolute inset-0 bg-black opacity-70 z-0"></div>
        )}
        <div className="relative z-10 p-4 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold">
            {business.hero_major_headline || "Trustworthy Roofing"}
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold mt-1 mb-4">
            {business.hero_minor_headline || "Demo (Test)"}
          </h2>
          <p className="mb-6 text-lg max-w-xl mx-auto">
            {business.hero_cta_text ||
              `Get a FREE Quote now CALL NOW ${
                business.phone || "(404) 907-7804"
              }`}
          </p>
          <a
            href="#contact-us"
            className="bg-red-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-red-700 transition text-lg"
          >
            {business.call_to_action_on_buttons || "GET A FREE QUOTE"}
          </a>
        </div>
      </div>

      <section className="bg-red-700 text-white py-10 md:py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">{business.banner_headline || 'Let Us Assist with Your Roof Repair or Replacement'}</h2>
          <a href="#contact-us" className="bg-gray-800 text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-900 transition text-lg">
            {business.banner_cta_button_text || 'GET A FREE QUOTE'}
          </a>
        </div>
      </section>

      <SectionWrapper id="about-us" className="scroll-mt-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-red-600 font-semibold mb-2 text-sm uppercase">{business.about_us_small_title || 'About Us'}</h3>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{business.about_us_headline || 'Top Roofing Contractors in TX'}</h2>
            <p className="text-gray-700 leading-relaxed">
              {business.about_us_main_paragraph || 
               `At ${business.business_name || 'Demo (Test)'}, we are more than just a roofing company; we are your trusted partners in protecting what matters most. With years of industry experience, we specialize in delivering high-quality roofing solutions tailored to meet your unique needs. Whether it's residential roof repairs, commercial installations, or emergency services, our dedicated team of professionals is committed to excellence in every project we undertake.`}
            </p>
          </div>
          <div className="order-1 md:order-2 relative aspect-video rounded-lg shadow-xl overflow-hidden"> {/* Added relative and overflow-hidden for Image with fill */} 
            {business.resolved_about_us_image ? (
              <Image 
                src={business.resolved_about_us_image} 
                alt="About Us - Roofing Contractors" 
                fill={true}
                style={{objectFit: 'cover'}}
              />
            ) : (
              <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500">Image Placeholder</div>
            )}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper id="services" className="bg-gray-50 scroll-mt-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{business.services_section_title || 'Our Services'}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5].filter(i => business[`service_${i}` as keyof BusinessData]).map(i => (
            <div key={i} className="shadow p-6 border rounded-lg transition-transform duration-300 transform hover:scale-105 hover:shadow-lg">
              <div className="relative w-full h-48 rounded-md mb-5 shadow overflow-hidden"> {/* Wrapper for Image */} 
                {business[`resolved_service_${i}_image` as keyof BusinessData] && (
                  <Image 
                    src={business[`resolved_service_${i}_image` as keyof BusinessData] as string}
                    alt={business[`service_${i}` as keyof BusinessData] as string || 'Service Image'}
                    fill={true}
                    style={{objectFit: 'cover'}}
                  />
                )}
              </div>
              <h3 className="font-semibold text-xl text-gray-800 mb-2 text-center">{business[`service_${i}` as keyof BusinessData]}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 text-center">{business[`paragraph_for_service_${i}` as keyof BusinessData]}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper id="testimonials" className="scroll-mt-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{business.testimonials_section_title || 'What Our Clients Say'}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <p className="text-gray-700 italic mb-4">“The team was professional, fast, and my new roof looks amazing. Their attention to detail was impressive.”</p>
            <p className="font-semibold text-gray-800">- Sandra T.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <p className="text-gray-700 italic mb-4">“They helped me with the insurance process and made everything seamless. Truly grateful for their excellent service!”</p>
            <p className="font-semibold text-gray-800">- James R.</p>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper id="faq" className="bg-gray-50 scroll-mt-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{business.faq_section_title || 'Frequently Asked Questions'}</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {[1,2,3,4,5,6,7,8,9,10].filter(i => business[`question_${i}` as keyof BusinessData] && business[`answer_${i}` as keyof BusinessData]).map(i => (
            <details key={i} className="bg-white p-4 rounded-lg shadow border border-gray-200 group">
              <summary className="font-semibold text-gray-800 cursor-pointer list-none flex justify-between items-center">
                {business[`question_${i}` as keyof BusinessData]}
                <span className="transform transition-transform duration-200 group-open:rotate-180">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                </span>
              </summary>
              <p className="text-gray-700 mt-2 text-sm leading-relaxed">{business[`answer_${i}` as keyof BusinessData]}</p>
            </details>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper id="contact-us" className="bg-gray-800 text-gray-200 scroll-mt-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">{business.contact_section_title || 'Contact Us'}</h2>
        <div className="max-w-lg mx-auto text-center bg-gray-700 p-8 rounded-lg shadow-xl">
          <p className="text-lg mb-2">Phone: <a href={`tel:${business.phone}`} className="hover:text-red-400">{business.phone}</a></p>
          <p className="text-lg mb-2">Email: <a href={`mailto:${business.email}`} className="hover:text-red-400">{business.email}</a></p>
          <p className="text-lg mb-6">{business.full_address}</p>
          <p className="text-sm">{business.contact_additional_info || 'We look forward to hearing from you!'}</p>
        </div>
      </SectionWrapper>

      <footer className="bg-neutral-900 text-gray-300 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">{business.logo_text || business.business_name || 'Rhino Roofers'}</h3>
              <p className="text-sm leading-relaxed">
                {business.footer_description || business.description || `Providing expert ${business.category || 'contractor'} services in ${business.city || 'your city'}, ${business.state || 'your state'}. Committed to quality and customer satisfaction.`}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                {navLinks.map(link => (
                  <li key={`footer-link-${link.label}`}>
                    <a href={link.href} className="hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
                <li><a href="#about-us" className="hover:text-white transition-colors">Why Choose Us</a></li> 
                <li><a href="#" className="hover:text-white transition-colors">Projects</a></li> 
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                {servicesForFooter.map(serviceName => (
                  serviceName && (
                    <li key={`footer-service-${serviceName}`}>
                      <a href="#services" className="hover:text-white transition-colors">
                        {serviceName}
                      </a>
                    </li>
                  )
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
              <address className="text-sm not-italic space-y-2">
                <p>{business.full_address || '123 Main St, Your City, ST 12345'}</p>
                <p>Phone: <a href={`tel:${business.phone}`} className="hover:text-white transition-colors">{business.phone || '(555) 123-4567'}</a></p>
                <p>Email: <a href={`mailto:${business.email}`} className="hover:text-white transition-colors">{business.email || 'info@example.com'}</a></p>
              </address>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} {business.business_name || 'Your Company Name'}. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
