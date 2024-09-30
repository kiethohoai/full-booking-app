import { useForm } from 'react-hook-form';

export type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
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
