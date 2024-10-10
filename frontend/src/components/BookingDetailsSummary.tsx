import { HotelType } from '../../../backend/src/shared/types';

type Props = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
  numberOfNights: number;
  hotel?: HotelType;
};

const BookingDetailsSummary = ({
  checkIn,
  checkOut,
  adultCount,
  childCount,
  numberOfNights,
  hotel,
}: Props) => {
  return (
    <div className="grid gap-4 border border-slate-300 rounded-lg p-5 h-fit">
      <h2 className="text-xl font-bold uppercase text-center">
        Your Booking Details
      </h2>
      <div className="border-b border-slate-300 py-2">
        Location:
        <span className="block font-bold">{`${hotel?.name}, ${hotel?.city}, ${hotel?.country}`}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="border-b border-slate-300 py-2 flex-1">
          Check-in:
          <span className="block font-bold">{checkIn.toDateString()}</span>
        </div>

        <div className="border-b border-slate-300 py-2 flex-1">
          Check-out:
          <span className="block font-bold">{checkOut.toDateString()}</span>
        </div>
      </div>

      <div className="border-b border-slate-300 py-2">
        Total length of stay:
        <span className="block font-bold">{numberOfNights}</span>
      </div>

      <div className="py-2">
        Guests:
        <span className="block font-bold">{`${adultCount} adults, ${childCount} children`}</span>
      </div>
    </div>
  );
};

export default BookingDetailsSummary;
