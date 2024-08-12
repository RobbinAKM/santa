import React from "react";

const Success: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Success!
          </h2>
          <p className="text-gray-600">
            Your message has been successfully received and will send to Santa
            soon! 🎅✨
          </p>
        </div>
        <div className="mt-6 flex justify-center">
          <a
            href="/"
            className="bg-red-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-600"
          >
            Go Back Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default Success;
