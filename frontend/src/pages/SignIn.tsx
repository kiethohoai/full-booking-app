import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import * as apiClient from '../api-client';
import { useAppContext } from '../contexts/AppContext';
import { Link, useNavigate } from 'react-router-dom';

export type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async () => {
      // Show Toast
      showToast({
        message: 'Signed In Successfully',
        type: 'SUCCESS',
      });

      await queryClient.invalidateQueries('validateToken');
      // Navigate Homepage
      navigate('/');
    },
    onError: (error: Error) => {
      // Show Toast
      showToast({
        message: error.message,
        type: 'ERROR',
      });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Sign In</h2>

      <label className="text-gray-700 text-sm font-bold flex-1">
        Email
        <input
          className="border rounded w-full py-1 px-2 font-normal"
          type="text"
          {...register('email', {
            required: 'This field is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: `Invalid email address`,
            },
          })}
        />
        {errors.email && (
          <span className="font-bold text-red-500">{errors.email.message}</span>
        )}
      </label>

      <label className="text-gray-700 text-sm font-bold flex-1">
        Password
        <input
          className="border rounded w-full py-1 px-2 font-normal"
          type="password"
          {...register('password', {
            required: 'This field is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
        />
        {errors.password && (
          <span className="font-bold text-red-500">
            {errors.password.message}
          </span>
        )}
      </label>

      <div>
        <div className="mb-3">
          <span>
            Not registered yet?{' '}
            <Link to="/register" className="underline italic">
              Create an account!
            </Link>
          </span>
        </div>

        <button
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-500"
          type="submit"
        >
          Sign In
        </button>
      </div>
    </form>
  );
};

export default SignIn;
