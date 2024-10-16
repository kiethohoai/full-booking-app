import BookingForm from '../forms/BookingForm/BookingForm';
import * as apiClient from '../api-client';
import { useQuery } from 'react-query';
import { useSearchContext } from '../contexts/useSearchContext';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BookingDetailsSummary from '../components/BookingDetailsSummary';
import { Elements } from '@stripe/react-stripe-js';
import { useAppContext } from '../contexts/useAppContext';

const Booking = () => {
  const { stripePromise } = useAppContext();
  const [numberOfNights, setNumberOfNights] = useState<number>(0);
  const { hotelId } = useParams();
  const search = useSearchContext();

  const { data: currentUser } = useQuery('fetCurrentUser', () =>
    apiClient.fetchCurrentUser(),
  );

  // todo task here!

  const { data: hotel } = useQuery(
    'fetchHotelById',
    () => apiClient.fetchHotelById(hotelId as string),
    {
      enabled: !!hotelId,
    },
  );

  const { data: paymentIntentData } = useQuery(
    'createPaymentIntent',
    () => apiClient.createPaymentIntent(hotelId as string, numberOfNights),
    {
      enabled: !!hotelId && numberOfNights > 0,
    },
  );

  useEffect(() => {
    if (search.checkIn && search.checkOut) {
      const nights = Math.round(
        (search.checkOut.getTime() - search.checkIn.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      setNumberOfNights(nights);
    }
  }, [search.checkIn, search.checkOut]);

  return (
    <div className="grid md:grid-cols-[1fr_2fr]">
      <div>
        <BookingDetailsSummary
          checkIn={search.checkIn}
          checkOut={search.checkOut}
          adultCount={search.adultCount}
          childCount={search.childCount}
          numberOfNights={numberOfNights}
          hotel={hotel}
        />
      </div>
      <div>
        {currentUser && paymentIntentData && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret: paymentIntentData.clientSecret,
            }}
          >
            <BookingForm
              currentUser={currentUser}
              paymentIntent={paymentIntentData}
            />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default Booking;
