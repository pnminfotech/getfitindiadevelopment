import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="terms-container px-4 sm:px-16 py-10 max-w-4xl mx-auto text-left">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>

      <p className="mb-4">
        Welcome to Get Fit India! By accessing or using our services, you agree
        to comply with and be bound by the following terms and conditions.
      </p>

      <h2 className="text-2xl font-semibold mb-4">1. Use of Services</h2>
      <p className="mb-4">
        You agree to use our services only for lawful purposes and in a way that
        does not infringe the rights of, restrict, or inhibit anyone else's use
        and enjoyment of the platform.
      </p>

      <h2 className="text-2xl font-semibold mb-4">2. Booking & Payments</h2>
      <p className="mb-4">
        All bookings made through Get Fit India are subject to availability. You
        agree to pay for services as per the prices listed, and all payments
        must be completed before the booking is confirmed.
      </p>

      <h2 className="text-2xl font-semibold mb-4">3. Cancellation & Refunds</h2>
      <p className="mb-4">
        Cancellations are allowed as per our cancellation policy. Refunds will
        be processed in accordance with the policy stated at the time of
        booking.
      </p>

      <h2 className="text-2xl font-semibold mb-4">4. Liability</h2>
      <p className="mb-4">
        Get Fit India is not liable for any injuries, damages, or losses
        incurred while using the services. Users participate at their own risk.
      </p>

      <h2 className="text-2xl font-semibold mb-4">5. Privacy</h2>
      <p className="mb-4">
        Your personal information will be handled in accordance with our Privacy
        Policy. By using our services, you consent to such data collection and
        usage.
      </p>

      <h2 className="text-2xl font-semibold mb-4">6. Changes to Terms</h2>
      <p className="mb-4">
        We reserve the right to update or modify these Terms and Conditions at
        any time. Continued use of our services constitutes acceptance of any
        changes.
      </p>
<p>Get fit India is the product made by Ashvamedh Sports</p>
      <p className="mt-6 text-sm text-gray-600">
        © {new Date().getFullYear()} Get Fit India. All rights reserved.
      </p>
    </div>
  );
};

export default TermsAndConditions;
