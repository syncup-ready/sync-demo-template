type ContactProps = {
    phone: string;
    email: string;
    address: string;
  };
  
  export default function ContactSection({ phone, email, address }: ContactProps) {
    return (
      <section className="bg-gray-900 text-white py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        <p className="mb-2">Phone: {phone}</p>
        <p className="mb-2">Email: {email}</p>
        <p>{address}</p>
      </section>
    );
  }
  