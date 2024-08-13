import React from "react";
import { useUserContext } from "../../context/userContext";
import { useTranslation } from "react-i18next";

const ErrorPage: React.FC = () => {
  const { userContext } = useUserContext();
  const { t } = useTranslation();

  const getErrorMessage = () => {
    if (userContext) {
      if (!userContext.exists) {
        return t("USER_NOT_FOUND", { id: userContext.id });
      }
      if (!userContext.isUnderTen) {
        return t("MORE_THAN_TEN", { name: userContext.name });
      }
    }
    return t("SOMETHING_WENT_WRONG");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Oops!</h1>
        <p className="text-lg text-gray-700 mb-6">{getErrorMessage()}</p>
        <div className="mt-6">
          <a
            href="/"
            className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            {t("BACK")}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
