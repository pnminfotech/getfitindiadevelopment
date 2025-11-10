import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy" style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", lineHeight: "1.6" }}>
      <h1>Privacy Policy</h1>
      <p><strong>Last updated:</strong> 01 September 2025</p>

      <p>
        Ashvamedh Sports ("we", "our", "us") is committed to protecting and respecting your privacy. This Privacy Policy explains what information we collect, why we collect it, and how we use it.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        <strong>Information you provide:</strong> name, email address, phone number, billing details when you sign up or purchase.<br />
        <strong>Automatically collected:</strong> usage and analytics data (page visits, device, IP address) to improve the service.
      </p>

      <h2>2. How We Use Your Information</h2>
      <p>
        We use personal information to deliver services, process payments, respond to requests, send important notices (account or billing), and improve our services.
      </p>

      <h2>3. Sharing & Third Parties</h2>
      <p>
        We do not sell personal data. We may share data with trusted service providers (payment processors like Razorpay, hosting, analytics) who are contractually bound to protect your data.
      </p>

      <h2>4. Security</h2>
      <p>
        We implement reasonable technical and organisational measures to protect personal data. No online transfer is 100% secure — we cannot guarantee absolute security but strive to protect your data.
      </p>

      <h2>5. Your Rights</h2>
      <p>
        You may request access, correction, or deletion of your personal data by contacting us at <a href="mailto:ashvamedhsports@gmail.com">ashvamedhsports@gmail.com</a>.
      </p>

      <h2>6. Cookies</h2>
      <p>
        We use cookies for analytics and to improve functionality. You can control cookies via your browser settings.
      </p>

      <h2>7. Changes to this Policy</h2>
      <p>
        We may update this policy occasionally. The “Last updated” date at the top will show when we made changes.
      </p>

      <h2>Contact</h2>
      <p>
        If you have questions about this Privacy Policy, contact: <a href="mailto:ashvamedhsports@gmail.com">ashvamedhsports@gmail.com</a> or call +91-98765 43210.
      </p>
<p>Get fit India is the product made by Ashvamedh Sports</p>
      <p className="mt-6 text-sm text-gray-600">
        © {new Date().getFullYear()} Get Fit India. All rights reserved.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
