import { hotelFacilities } from '../config/hotel-options-config';

type Props = {
  selectedHotelFacilities: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const HotelFacilitiesFilter = ({ selectedHotelFacilities, onChange }: Props) => {
  return (
    <div className="border-b border-slate-300 pb-5">
      <h4 className="text-md font-semibold mb-2">Hotel Facilities</h4>
      {hotelFacilities.map((facility) => (
        <label key={facility} className="flex items-center space-x-2">
          <input
            type="checkbox"
            value={facility}
            checked={selectedHotelFacilities.includes(facility)}
            onChange={onChange}
          />
          <span>{facility}</span>
        </label>
      ))}
    </div>
  );
};

export default HotelFacilitiesFilter;
