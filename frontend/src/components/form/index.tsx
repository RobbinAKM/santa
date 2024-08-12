import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCheckUser from "../../hooks/useUser";
import useHandleUserData from "../../hooks/useHandleUserData";
import { useUserContext } from "../../context/userContext";

const Form: React.FC = () => {
  const initialState = {
    id: "",
    message: "",
  };

  const [userData, setUserData] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);

  const { id, message } = userData;

  // Destructure the results from the useCheckUser hook which checks user existence and age validation
  const { exists, isUnderTen, loading, userInfo, error } = useCheckUser({
    id,
    submitted,
  });

  // Use the useHandleUserData hook to manage navigation and local storage based on the form submission
  useHandleUserData({
    submitted, // Indicates if the form has been submitted
    exists, // Boolean indicating if the user exists
    isUnderTen, // Boolean indicating if the user is under ten years old
    loading, // Boolean indicating if the request is still in progress
    error, // Error message, if any occurred during the API request
    userInfo, // User information retrieved from the API
    message, // User message to santa for storing in local memory
  });

  const { userContext, setUserContext } = useUserContext();

  console.log("userContext", userContext);

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setSubmitted(false);
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUserContext({ id });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Send Your Message To Santa
        </h2>

        <div className="mb-4">
          <label
            htmlFor="id"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            ID
          </label>
          <input
            id="id"
            type="text"
            value={id}
            name="id"
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Enter your ID"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="message"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Message
          </label>
          <textarea
            id="message"
            value={message}
            name="message"
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Enter your message"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;
