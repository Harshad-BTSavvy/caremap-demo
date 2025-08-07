import React, { createContext, useContext, useState } from "react";

export interface TrackItem {
  id: number;
  category_id: number;
  name: string;
}

export interface TrackCategory {
  id: number;
  title: string;
  trackItemData: TrackItem[];
}

type SelectedItemsContextType = {
  selected: TrackCategory[];
  setSelected: React.Dispatch<React.SetStateAction<TrackCategory[]>>;
};

const SelectedItemsContext = createContext<
  SelectedItemsContextType | undefined
>(undefined);

export const SelectedItemsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selected, setSelected] = useState<TrackCategory[]>([]);
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
