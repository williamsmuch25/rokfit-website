import React from "react";

const WhyJumia = () => {
  return (
    <section className="w-full bg-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Why We Recommend Jumia:</h2>

        <ul className="space-y-4">
          <li>
            <strong>* Affordable Delivery</strong> - Spend less than ₦2000
            nationwide.
          </li>
          <li>
            <strong>* Nationwide Reach</strong> - Delivery to every state in
            Nigeria.
          </li>
          <li>
            <strong>* Trusted Payments</strong> - Secure checkout via Jumia.
          </li>
          <li>
            <strong>* Fast Dispatch</strong> - Quick delivery to your doorstep.
          </li>
        </ul>
      </div>
      <p className="mt-4 text-sm text-gray-500 text-center max-w-xl mx-auto">
        <strong>Note:</strong> Don’t want to order via Jumia? <br />
        We also offer custom delivery options based on your preference. <br />
        <a
          href="https://wa.me/2347089472543?text=Hello%20ROKFit%2C%20I%20want%20to%20order%20with%20custom%20delivery."
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-400 font-medium hover:underline"
        >
          Contact us on WhatsApp
        </a>
      </p>
    </section>
  );
};

export default WhyJumia;
