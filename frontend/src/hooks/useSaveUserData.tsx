import { useState } from "react";
import axios from "axios";

interface UserData {
  id: string | undefined;
  name: string | undefined;
  address: string | undefined;
  message: string;
}

interface UseSaveUserDataProps {
  userData: UserData;
}

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
});

const useSaveUserData = ({ userData }: UseSaveUserDataProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const saveUserData = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axiosInstance.post("/api/saveUserData", userData);
      setSuccess(true);
    } catch (err) {
      setError("Error saving user data");
      console.error("Error saving user data:", err);
    } finally {
      setLoading(false);
    }
  };

  return { saveUserData, loading, error, success };
};

export default useSaveUserData;
