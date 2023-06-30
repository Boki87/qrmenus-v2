"use client";
import { ReactNode, createContext, useContext, useState } from "react";

interface GlobalContextInterface {
  showPreview: boolean;
  setShowPreview: (val: boolean) => void;
}

const initialState = {
  showPreview: false,
  setShowPreview: () => {},
};

const StoreGlobalContext = createContext<GlobalContextInterface>(initialState);

export const useStoreGlobalContext = () => useContext(StoreGlobalContext);

export default function StoreGlobalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <StoreGlobalContext.Provider value={{ showPreview, setShowPreview }}>
      {children}
    </StoreGlobalContext.Provider>
  );
}
