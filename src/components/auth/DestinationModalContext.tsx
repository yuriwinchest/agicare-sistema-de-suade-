
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DestinationModalContextType {
  showDestinationModal: boolean;
  setShowDestinationModal: (show: boolean) => void;
}

const DestinationModalContext = createContext<DestinationModalContextType | null>(null);

export const useDestinationModal = (): DestinationModalContextType => {
  const context = useContext(DestinationModalContext);
  if (!context) {
    throw new Error('useDestinationModal must be used within a DestinationModalProvider');
  }
  return context;
};

export const DestinationModalProvider = ({ children }: { children: ReactNode }) => {
  const [showDestinationModal, setShowDestinationModal] = useState(false);

  return (
    <DestinationModalContext.Provider value={{ showDestinationModal, setShowDestinationModal }}>
      {children}
    </DestinationModalContext.Provider>
  );
};
