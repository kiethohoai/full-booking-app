import { useFormContext } from 'react-hook-form';
import { hotelFacilities } from '../../config/hotel-options-config';
import { HotelFormData } from './ManageHotelForm';

const FacilitiesSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Facilities</h2>
      <div className="grid grid-cols-5 gap-3">
        {hotelFacilities.map((facility) => (
          <label key={facility} className="flex items-center gap-1 text-gray-700">
            <input
              type="checkbox"
              value={facility}
              {...register('facilities', {
                validate: (value) => {
                  if (value && value.length > 0) return true;
                  else return 'At least one facility is required';
                },
              })}
            />
            {facility}
          </label>
        ))}
      </div>
      {errors.facilities && (
        <span className="font-bold text-red-500">
          {errors.facilities.message}
        </span>
      )}
    </div>
  );
};

export default FacilitiesSection;
