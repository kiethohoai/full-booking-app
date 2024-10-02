import { useFormContext } from 'react-hook-form';
import { HotelFormData } from './ManageHotelForm';

const ImagesSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <div className="flex flex-col gap-4 border rounded p-4">
        <input
          type="file"
          multiple //User can upload multiple images
          accept="image/*" //User only upload images, the other files are not accepted
          className="w-full text-gray-700 font-normal"
          {...register('imageUrls', {
            validate: (imageFiles) => {
              const totalFiles = imageFiles.length;
              if (totalFiles === 0) return 'At least one image is required';
              if (totalFiles >= 6) return 'Maximum 5 images are allowed';
              return true;
            },
          })}
        />
      </div>
      {errors.imageUrls && (
        <span className="font-bold text-red-500">
          {errors.imageUrls.message}
        </span>
      )}
    </div>
  );
};

export default ImagesSection;
