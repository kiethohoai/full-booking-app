import { useFormContext } from 'react-hook-form';
import { HotelFormData } from './ManageHotelForm';

const GuestsSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  return (
    <div className="mb-1">
      <h2 className="text-2xl font-bold">Guests</h2>
      {/* <div className="grid grid-cols-2 gap-5 bg-gray-200 rounded p-6"> */}
      <div className="flex gap-5 bg-gray-200 rounded p-6">
        <div className="flex-1">
          <label className="text-gray-700 text-sm font-semibold">
            Adults
            <input
              className="border rounded w-full py-2 px-3 font-normal"
              type="number"
              min={1}
              {...register('adultCount', {
                required: 'This field is required',
              })}
            />
          </label>
          {errors.adultCount && (
            <span className="font-bold text-red-500">
              {errors.adultCount.message}
            </span>
          )}
        </div>

        <div className="flex-1">
          <label className="text-gray-700 text-sm font-semibold">
            Childs
            <input
              className="border rounded w-full py-2 px-3 font-normal"
              type="number"
              min={1}
              {...register('childCount', {
                required: 'This field is required',
              })}
            />
          </label>
          {errors.childCount && (
            <span className="font-bold text-red-500">
              {errors.childCount.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestsSection;
