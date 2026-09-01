import React, { useContext } from "react";
import { Button } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";

//internal import
import { SidebarContext } from "@/context/SidebarContext";
import spinnerLoadingImage from "@/assets/img/spinner.gif";

const DrawerButton = ({ id, title, isSubmitting }) => {
  const { t } = useTranslation();
  const { toggleDrawer, isDrawerOpen } = useContext(SidebarContext);
  return (
    <>
      <div
        className="fixed z-10 bottom-0 w-full right-0 py-4 lg:py-8 px-6 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex bg-[#FFFBE9] border-t border-[#E3CAA5]"
        style={{ right: !isDrawerOpen && -50 }}
      >
        <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
          <button
            type="button"
            onClick={toggleDrawer}
            className="h-12 w-full rounded-lg font-bold transition-all duration-200 border-2 border-[#E3CAA5] bg-white text-[#AD8B73] hover:bg-[#FFFBE9] hover:border-[#AD8B73]"
          >
            {t("CancelBtn")}
          </button>
        </div>

        <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
          {isSubmitting ? (
            <button disabled={true} type="button" className="flex justify-center items-center h-12 w-full rounded-lg font-bold transition-all duration-200 bg-[#AD8B73] text-white opacity-70">
              <img
                src={spinnerLoadingImage}
                alt="Loading"
                width={20}
                height={10}
              />{" "}
              <span className="font-serif ml-2 font-light">Processing</span>
            </button>
          ) : (
            <button type="submit" className="h-12 w-full rounded-lg font-bold transition-all duration-200 bg-[#AD8B73] text-white hover:bg-[#8B6B57]">
              {id ? (
                <span>
                  {t("UpdateBtn")} {title}
                </span>
              ) : (
                <span>Add {title}</span>
              )}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default DrawerButton;
