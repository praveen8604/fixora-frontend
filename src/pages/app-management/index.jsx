import React, { useState } from "react";
import AppManagementHeader from "./layouts/AppManagementHeader";
import ManagementList from "./layouts/ManagementList";

const AppManagement = () => {
  const [isDispatch, setIsDispatch] = useState(false);
  const [filterDragger, setFilterDragger] = useState(false);
  const [currentLink, setCurrentLink] = useState("");
  const [editValue, setEditValue] = useState({});

  const handleEditValue = (value) => {
    setEditValue(value);
  };

  const getManagementList = () => {
    setIsDispatch(true);

    setTimeout(() => {
      setIsDispatch(false);
    }, 100);
  };

  return (
    <div className="w-full">
      <AppManagementHeader
        setFilterDragger={setFilterDragger}
        getManagementList={getManagementList}
        filterDragger={filterDragger}
        setCurrentLink={setCurrentLink}
        currentLink={currentLink}
        editValue={editValue}
      />

      <ManagementList
        isDispatch={isDispatch}
        setFilterDragger={setFilterDragger}
        currentLink={currentLink}
        setEditValue={handleEditValue}
        filterDragger={filterDragger}
      />
    </div>
  );
};

export default AppManagement;
