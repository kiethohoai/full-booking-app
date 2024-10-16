import React, { useState } from 'react';
import Toast from '../components/Toast';
import { useQuery } from 'react-query';
import * as apiClient from '../api-client';
import { loadStripe, Stripe } from '@stripe/stripe-js';

const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || '';

// ToastMessage
type ToastMessage = {
  message: string;
  type: 'SUCCESS' | 'ERROR';
};

// AppContext
type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
  stripePromise: Promise<Stripe | null>;
};

export const AppContext = React.createContext<AppContext | undefined>(
  undefined,
);

const stripePromise = loadStripe(STRIPE_PUB_KEY);

// AppContextProvider
export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
  const { isError } = useQuery('validateToken', apiClient.validateToken, {
    retry: false, //failed queries will not retry by default.
  });

  return (
    <AppContext.Provider
      value={{
        showToast: (toastMessage) => {
          // console.log(`🚀toastMessage =>`, toastMessage);
          setToast(toastMessage);
        },
        isLoggedIn: !isError,
        stripePromise,
      }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)}
        />
      )}
      {children}
    </AppContext.Provider>
  );
};

// useAppContext
// export const useAppContext = () => {
//   const context = React.useContext(AppContext);
//   if (context === undefined) {
//     throw new Error('useAppContext must be used within a AppContextProvider');
//   }
//   return context;
// };
