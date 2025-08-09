import React, { createContext, useContext, useState } from "react";

export interface TrackCategory {
  id: number;
  name: string;
  created_date?: string;
  updated_date?: string;
}

export interface TrackItem {
  id: number;
  category_id: number;
  name: string;
  created_date?: string;
  updated_date?: string;
}

export interface TrackItemSelectable {
  item: TrackItem;
  selected: boolean;
}

export interface TrackCategoryWithSelectableItems {
  category: TrackCategory;
  items: TrackItemSelectable[];
}

// ------------------
export interface TrackItemWithProgress {
  item: TrackItem;
  completed: number;
  total: number;
  started: boolean;
}

export interface TrackCategoryWithItems {
  category: TrackCategory;
  items: TrackItemWithProgress[];
}
//----------------

type SelectedItemsContextType = {
  selected: TrackCategoryWithSelectableItems[];
  setSelected: React.Dispatch<
    React.SetStateAction<TrackCategoryWithSelectableItems[]>
  >;
};

const SelectedItemsContext = createContext<
  SelectedItemsContextType | undefined
>(undefined);

export const TrackContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selected, setSelected] = useState<TrackCategoryWithSelectableItems[]>(
    []
  );
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
