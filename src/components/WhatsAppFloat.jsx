import { FaWhatsapp } from "react-icons/fa";

const WhatsAppFloat = () => {
  const message = encodeURIComponent(
    "Hi ROKFit 👋 I’d like to ask about your gym products."
  );

  return (
    <a
      href={`https://wa.me/2347089472543?text=${message}`}
      target="_blank"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:scale-105 transition z-50"
    >
      <FaWhatsapp size={28} />
    </a>
  );
};

export default WhatsAppFloat;
