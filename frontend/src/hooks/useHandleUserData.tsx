import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserInfo } from "./useUser";
import useSaveUserData from "./useSaveUserData";

interface UseHandleNavigationProps {
  submitted: boolean;
  exists: boolean | null;
  isUnderTen: boolean | null;
  loading: boolean;
  error: string | null;
  userInfo: UserInfo | undefined;
  message: string;
}

const useHandleUserData = ({
  submitted,
  exists,
  isUnderTen,
  loading,
  error,
  userInfo,
  message,
}: UseHandleNavigationProps) => {
  const navigate = useNavigate();

  const contentsToSave = {
    userData: {
      id: userInfo?.id,
      name: userInfo?.name,
      address: userInfo?.address,
      message,
    },
  };

  const { saveUserData, success } = useSaveUserData(contentsToSave);
  useEffect(() => {
    if (!loading && submitted && isUnderTen && exists) {
      saveUserData();
      success && navigate("/success");
    }
    if (error || !isUnderTen) {
      navigate("/error");
    }
  }, [submitted, exists, isUnderTen, loading, error, success, navigate]);
};

export default useHandleUserData;
