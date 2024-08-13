import { useState, useEffect } from "react";
import axios from "axios";
import { useUserContext } from "../context/userContext";

interface UserCheckResponse {
  exists: boolean;
  isUnderTen: boolean;
  user: UserInfo;
}

interface UseCheckUserIdProps {
  id: string | undefined;
  submitted: boolean; // New parameter to control when to check
}

export interface UserInfo {
  id?: string;
  name?: string;
  address?: string;
  birthdate?: string;
  isUnderTen?: boolean;
  exists?: boolean;
}

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
});

const useCheckUser = ({ id, submitted }: UseCheckUserIdProps) => {
  const [exists, setExists] = useState<boolean>(false);
  const [isUnderTen, setIsUnderTen] = useState<boolean>(true); // assume all kids are under 10 and can write message to santa
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { setUserContext } = useUserContext();

  useEffect(() => {
    if (submitted && id) {
      setLoading(true);
      // Only check if form is submitted
      const checkUserId = async () => {
        try {
          const response = await axiosInstance.get<UserCheckResponse>(
            `/api/user/${id}`
          );
          setExists(true);
          setIsUnderTen(response.data.isUnderTen);
          setUserInfo(response.data.user);
          setUserContext({
            ...response.data.user,
            isUnderTen: response.data.isUnderTen,
            exists: true,
          });
          setError(null);
        } catch (err) {
          setExists(false);
          setIsUnderTen(false);
          setError("Error checking user ID");
          console.error("Error checking user ID:", err);
        } finally {
          setLoading(false);
        }
      };

      checkUserId();
    }
  }, [id, submitted, setUserContext]); // Depend on both id and submitted

  return { exists, isUnderTen, userInfo, loading, error };
};

export default useCheckUser;
