import { useMutation, useQueryClient } from 'react-query';
import * as apiClient from '../api-client';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/useAppContext';

const SignOutButton = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      await queryClient.invalidateQueries('validateToken');
      showToast({
        message: 'Signed Out Successfully',
        type: 'SUCCESS',
      });
      navigate('/sign-in');
    },
    onError: (error: Error) => {
      showToast({
        message: error.message,
        type: 'ERROR',
      });
    },
  });

  const handleSignOut = () => {
    mutation.mutate();
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center text-blue-600 px-3 py-1 font-bold hover:bg-gray-100 hover:text-blue-500 bg-white rounded-sm"
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
