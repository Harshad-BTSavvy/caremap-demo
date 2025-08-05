import React, { createContext, useContext, useState } from "react";

type SelectedGroup = {
  title: string;
  data: string[];
};

type SelectedItemsContextType = {
  selected: SelectedGroup[];
  setSelected: React.Dispatch<React.SetStateAction<SelectedGroup[]>>;
};

const SelectedItemsContext = createContext<
  SelectedItemsContextType | undefined
>(undefined);

export const SelectedItemsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selected, setSelected] = useState<SelectedGroup[]>([]);
  return (
    <SelectedItemsContext.Provider value={{ selected, setSelected }}>
      {children}
    </SelectedItemsContext.Provider>
  );
};

export const useSelectedItems = () => {
  const context = useContext(SelectedItemsContext);
  if (!context)
    throw new Error(
      "useSelectedItems must be used within SelectedItemsProvider"
    );
  return context;
};
