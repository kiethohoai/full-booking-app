import React from 'react';

// ToastMessage
type ToastMessage = {
  message: string;
  type: 'SUCCESS' | 'ERROR';
};

// AppContext
type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
};

const AppContext = React.createContext<AppContext | undefined>(undefined);

// AppContextProvider
export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <AppContext.Provider
      value={{
        showToast: (toastMessage) => {
          console.log(`🚀toastMessage =>`, toastMessage);
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// useAppContext
export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }
  return context;
};
