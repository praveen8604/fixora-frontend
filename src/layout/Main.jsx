import { AdminContext } from "@/context/AdminContext";
import React, { useContext, useEffect, useRef } from "react";

const Main = ({ children }) => {
  const mainRef = useRef();
  const { dimentions } = useContext(AdminContext);
  useEffect(() => {
    const calculateWidth = () => {
      if (mainRef.current) {
        document.documentElement.style.setProperty(
          "--doc-main-width",
          `${(mainRef.current.offsetWidth - 65) / 2}px`
        );
      }
    };

    calculateWidth();

    window.addEventListener("resize", calculateWidth);

    return () => {
      window.removeEventListener("resize", calculateWidth);
    };
  }, [dimentions]);

  return (
    <main
      className="flex-1 min-h-0 overflow-y-auto"
      ref={mainRef}
    >
      <div className="grid ">
        {children}
      </div>
    </main>
  );
};

export default Main;
