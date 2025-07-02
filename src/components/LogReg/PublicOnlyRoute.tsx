import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@pexeso/lib/redux/store/store";

const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const { lang } = useParams();

  // if user is logged in -> redirect

  useEffect(() => {
    if (user) {
      navigate(`/${lang}/`);
    }
  }, [user, navigate, lang]);

  if (user) return null; // alebo spinner

  return <>{children}</>;
};

export default PublicOnlyRoute;
