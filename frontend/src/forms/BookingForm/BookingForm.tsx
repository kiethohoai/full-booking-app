import { useForm } from 'react-hook-form';
import {
  PaymentIntentRespone,
  UserType,
} from '../../../../backend/src/shared/types';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeCardElement } from '@stripe/stripe-js';
import { useSearchContext } from '../../contexts/useSearchContext';
import { useParams } from 'react-router-dom';
import { useMutation } from 'react-query';
import * as apiClient from '../../api-client';
import { useAppContext } from '../../contexts/useAppContext';

type Props = {
  currentUser: UserType;
  paymentIntent: PaymentIntentRespone;
};

export type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkIn: string;
  checkOut: string;
  hotelId: string;
  paymentIntentId: string;
  totalCost: number;
};

const BookingForm = ({ currentUser, paymentIntent }: Props) => {
  const stripe = useStripe();
  const elements = useElements();

  const search = useSearchContext();
  const { showToast } = useAppContext();
  const { hotelId } = useParams();

  const { mutate: bookRoom, isLoading } = useMutation(
    apiClient.createRoomBooking,
    {
      onSuccess: () => {
        showToast({
          message: 'Room booked successfully',
          type: 'SUCCESS',
        });
      },
      onError: () => {
        showToast({
          message: 'Error booking room',
          type: 'ERROR',
        });
      },
    },
  );

  const { register, handleSubmit } = useForm<BookingFormData>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      adultCount: search.adultCount,
      childCount: search.childCount,
      checkIn: search.checkIn.toISOString(),
      checkOut: search.checkOut.toISOString(),
      hotelId: hotelId,
      paymentIntentId: paymentIntent.paymentIntentId,
      totalCost: paymentIntent.totalCost,
    },
  });

  // On Submit
  const onSubmit = async (formData: BookingFormData) => {
    if (!stripe || !elements) return;

    const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement) as StripeCardElement,
      },
    });

    if (result.paymentIntent?.status === 'succeeded') {
      // Book the room
      bookRoom({ ...formData, paymentIntentId: result.paymentIntent.id });
    }
  };

  // Return
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 border border-slate-300 rounded-lg p-4"
    >
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

        <div>
          <label className="text-sm text-gray-700 font-bold">
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
      </div>

      <div className="space-y-2">
        <h2 className="text-xl  font-semibold">Your price summary</h2>
        <div className="bg-blue-200 px-3 py-2 rounded-md">
          <div className="font-bold text-lg">
            Total Cost: ${paymentIntent.totalCost.toFixed(2)}
          </div>
          <div className="text-xs">Includes tax and charges</div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Payment Detail</h3>
        <CardElement
          id="payment-element"
          className="border border-slate-300 rounded px-2 py-3"
        />
      </div>

      <div className="flex justify-end">
        <button
          disabled={isLoading}
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-500"
        >
          {isLoading ? 'Saving...' : 'Confirm Booking'}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
