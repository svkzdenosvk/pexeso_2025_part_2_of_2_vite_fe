import LanguageInit from "../LanguageInit";
import { Outlet } from "react-router-dom";
import ButtonLogReg from "@pexeso/components/LogReg/ButtonLogReg";

const SharedLangLayout = () => {
  return (
    <>
      <LanguageInit />
      <ButtonLogReg />

      <Outlet />
    </>
  );
};

export default SharedLangLayout;
