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
      className="h-full overflow-y-auto ease-in-out transition-all"
      style={{
        width: "calc(100% - 72px)",
        marginLeft: "72px",
        transitionDuration: "0.5s",
      }}
      ref={mainRef}
    >
      <div className=" grid lg:px-6 sm:px-4 px-2 mx-auto">
        {children}
      </div>
    </main>
  );
};

export default Main;
