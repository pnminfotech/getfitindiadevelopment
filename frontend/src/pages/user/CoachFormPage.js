import React from "react";

const CoachFormPage = () => {
  const googleFormUrl = "https://forms.gle/ph5DXNoyDCCqKj6N9"; // Replace with your actual form link

  const handleOpenForm = () => {
    window.open(googleFormUrl, "_blank");
  };

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Coach Registration</h2>
      <p className="text-gray-600 mb-6">
        Fill the Google Form to register as a coach. Our team will verify your details and contact you.
      </p>
      <button
        onClick={handleOpenForm}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Fill Coach Registration Form
      </button>
    </div>
  );
};

export default CoachFormPage;
