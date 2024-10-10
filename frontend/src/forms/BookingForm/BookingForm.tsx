import { useForm } from 'react-hook-form';
import { UserType } from '../../../../backend/src/shared/types';

type Props = {
  currentUser: UserType;
};

type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
};

const BookingForm = ({ currentUser }: Props) => {
  const { register, handleSubmit } = useForm<BookingFormData>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
    },
  });

  return (
    <form className="grid grid-cols-1 gap-5 border border-slate-300 rounded-lg p-4">
      <h3 className="text-3xl font-bold text-center">CONFIRM YOUR DETAILS</h3>
      <div className="grid grid-cols-2 gap-6">
        <label className="text-sm text-gray-700 font-bold flex-1">
          First Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register('firstName')}
          />
        </label>
        <label className="text-sm text-gray-700 font-bold flex-1">
          Last Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register('lastName')}
          />
        </label>
      </div>

      <div>
        <label className="text-sm text-gray-700 font-bold flex-1">
          Email
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="email"
            readOnly
            disabled
            {...register('email')}
          />
        </label>
      </div>
    </form>
  );
};

export default BookingForm;
