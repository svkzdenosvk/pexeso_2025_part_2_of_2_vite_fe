import LanguageInit from "../LanguageInit";
import { Outlet } from "react-router-dom";

const SharedLangLayout = () => {
  return (
    <>
      <LanguageInit />

      <Outlet />
    </>
  );
};

export default SharedLangLayout;
