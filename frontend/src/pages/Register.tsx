import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import * as apiClient from '../api-client';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/useAppContext';

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  // Fetch with React Query
  const mutation = useMutation(apiClient.register, {
    onSuccess: async () => {
      // console.log('🚀User Registered');
      showToast({
        message: 'User Registered',
        type: 'SUCCESS',
      });

      await queryClient.invalidateQueries('validateToken');
      navigate('/');
    },
    onError: (error: Error) => {
      // console.log(`🚀  error =>`, error.message);
      showToast({
        message: error.message,
        type: 'ERROR',
      });
    },
  });

  const onSubmit = handleSubmit((data) => {
    // console.log(data);
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Create an Account</h2>

      <div className="flex flex-col gap-5 md:flex-row">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            type="text"
            {...register('firstName', {
              required: 'This field is required',
            })}
          />
          {errors.firstName && (
            <span className="font-bold text-red-500">{errors.firstName.message}</span>
          )}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            type="text"
            {...register('lastName', {
              required: 'This field is required',
            })}
          />
          {errors.lastName && (
            <span className="font-bold text-red-500">{errors.lastName.message}</span>
          )}
        </label>
      </div>

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
        {errors.email && <span className="font-bold text-red-500">{errors.email.message}</span>}
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
          <span className="font-bold text-red-500">{errors.password.message}</span>
        )}
      </label>

      <label className="text-gray-700 text-sm font-bold flex-1">
        Password Confirm
        <input
          className="border rounded w-full py-1 px-2 font-normal"
          type="password"
          {...register('passwordConfirm', {
            required: 'This field is required',
            validate: (value) => {
              if (!value) {
                return `This field is required`;
              }
              if (value !== watch('password')) {
                return `Passwords do not match`;
              }
            },
          })}
        />
        {errors.passwordConfirm && (
          <span className="font-bold text-red-500">{errors.passwordConfirm.message}</span>
        )}
      </label>

      <div>
        <button
          onClick={(e) => onSubmit(e)}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-500"
          type="submit"
        >
          Create Account
        </button>
      </div>
    </form>
  );
};

export default Register;
