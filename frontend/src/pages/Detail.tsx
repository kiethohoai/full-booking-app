import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import * as apiClient from '../api-client';
import { AiFillStar } from 'react-icons/ai';

const Detail = () => {
  const { hotelId } = useParams();

  const { data: hotel } = useQuery(
    'fetchHotelById',
    () => apiClient.fetchHotelById(hotelId || ''),
    {
      enabled: !!hotelId, //If no hotelId, don't fetch
      // retry: 3,
    },
  );

  if (!hotel) {
    return <></>;
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="flex">
          {Array.from({ length: hotel.starRating }).map((el) => (
            <AiFillStar
              className="fill-orange-500"
              key={`star-icon-${el}-${Math.random()}`}
            />
          ))}
        </span>
        <h1 className="text-3xl font-bold">{hotel.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {hotel.imageUrls.map((url, index) => (
          <div key={`image-${index}-${Math.random()}`} className="h-[300px]">
            <img
              src={url}
              alt={hotel.name}
              className="w-full h-full object-cover object-center rounded-md"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        {hotel.facilities.map((facility, index) => (
          <div
            key={`facility-${index}-${Math.random()}`}
            className="border border-slate-300 rounded-lg p-3"
          >
            {facility}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-2">
        <div className="whitespace-pre-line">{hotel.description}</div>
        <div className="h-fit">
          {/* GuestInfoForm */}
          GuestInfoForm
        </div>
      </div>
    </div>
  );
};

export default Detail;
