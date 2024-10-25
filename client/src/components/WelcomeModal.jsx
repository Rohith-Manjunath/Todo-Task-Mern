import React, { useState, useEffect } from "react";

const WelcomeModal = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if the user has seen the modal before
    const hasVisited = sessionStorage.getItem("hasVisited");
    if (!hasVisited) {
      setShowModal(true); // Show the modal if this is the first visit
      sessionStorage.setItem("hasVisited", "true"); // Set flag to avoid showing modal again
    }
  }, []);

  const handleClose = () => setShowModal(false);

  if (!showModal) return null; // Hide modal if not needed

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="w-full h-full flex">
        {/* Left Side (Blue Background) */}
        <div className="w-7/12 bg-blue-600"></div>

        {/* Right Side (Content Area) */}
        <div className="w-5/12 bg-white flex flex-col justify-center items-center p-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Manage What To Do
          </h1>
          <p className="text-gray-600 text-center mb-6">
            The best way to manage what you have to do, don&apos;t forget your
            plans.
          </p>
          <button
            onClick={handleClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
