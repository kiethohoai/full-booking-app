import {
  HotelSearchRespone,
  HotelType,
  PaymentIntentRespone,
  UserType,
} from './../../backend/src/shared/types';
import { BookingFormData } from './forms/BookingForm/BookingForm';
import { RegisterFormData } from './pages/Register';
import { SignInFormData } from './pages/SignIn';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// todo fetchCurrentUser
export const fetchCurrentUser = async (): Promise<UserType> => {
  const res = await fetch(`${API_BASE_URL}/api/users/me`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Failed to fetching user!');
  }

  return await res.json();
};

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
    credentials: 'include',
  });

  const responeBody = await response.json();

  if (!response.ok) {
    throw new Error(responeBody.message);
  }

  return responeBody;
};

// todo signIn
export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
    credentials: 'include',
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message);
  }

  return body;
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Invalid Token');
  }

  return await response.json();
};

// todo signOut
export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Logout Failed');
  }

  return await response.json();
};

// todo addMyHotel
export const addMyHotel = async (hotelFormData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    method: 'POST',
    credentials: 'include',
    body: hotelFormData,
  });

  if (!response.ok) {
    throw new Error('Fail to add hotel');
  }

  return await response.json();
};

// todo fetchMyHotels
export const fetchMyHotels = async (): Promise<HotelType[]> => {
  const res = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Fail to fetch hotels');
  }

  return await res.json();
};

// todo fetchMyHotelById
export const fetchMyHotelById = async (hotelId: string): Promise<HotelType> => {
  const res = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Fail to fetch hotel');
  }

  return await res.json();
};

// todo updateMyHotelById
export const updateMyHotelById = async (hotelFormData: FormData) => {
  const res = await fetch(
    `${API_BASE_URL}/api/my-hotels/${hotelFormData.get('hotelId')}`,
    {
      method: 'PUT',
      credentials: 'include',
      body: hotelFormData,
    },
  );

  if (!res.ok) {
    throw new Error('Fail to update hotel');
  }

  return await res.json();
};

// todo SearchParams Type
export type SearchParams = {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  adultCount?: string;
  childCount?: string;
  page?: string;

  facilities?: string[];
  types?: string[];
  stars?: string[];
  maxPrice?: string;
  sortOptions?: string;
};

// todo searchHotels
export const searchHotels = async (
  searchParams: SearchParams,
): Promise<HotelSearchRespone> => {
  const queryParams = new URLSearchParams();
  queryParams.append('destination', searchParams.destination || '');
  queryParams.append('checkIn', searchParams.checkIn || '');
  queryParams.append('checkOut', searchParams.checkOut || '');
  queryParams.append('adultCount', searchParams.adultCount || '');
  queryParams.append('childCount', searchParams.childCount || '');
  queryParams.append('page', searchParams.page || '');

  queryParams.append('maxPrice', searchParams.maxPrice || '');
  queryParams.append('sortOptions', searchParams.sortOptions || '');

  searchParams.facilities?.forEach((facility) => {
    queryParams.append('facilities', facility);
  });
  searchParams.types?.forEach((type) => {
    queryParams.append('types', type);
  });
  searchParams.stars?.forEach((star) => {
    queryParams.append('stars', star);
  });

  const respone = await fetch(
    `${API_BASE_URL}/api/hotels/search?${queryParams}`,
    {
      method: 'GET',
      credentials: 'include',
    },
  );

  if (!respone.ok) {
    throw new Error('Fail to fetch hotels');
  }

  return await respone.json();
};

// todo fetchHotelById
export const fetchHotelById = async (hotelId: string): Promise<HotelType> => {
  const respone = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!respone.ok) {
    throw new Error('Fail to fetch single hotel');
  }

  return await respone.json();
};

//todo createPaymentIntent
export const createPaymentIntent = async (
  hotelId: string,
  numberOfNights: number,
): Promise<PaymentIntentRespone> => {
  const respone = await fetch(
    `${API_BASE_URL}/api/hotels/${hotelId}/bookings/payment-intent`,
    {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ numberOfNights }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!respone.ok) {
    throw new Error('Error fetching payment intent');
  }

  return await respone.json();
};

// => createRoomBooking
export const createRoomBooking = async (formData: BookingFormData) => {
  const respone = await fetch(
    `${API_BASE_URL}/api/hotels/${formData.hotelId}/bookings`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(formData),
    },
  );

  if (!respone.ok) {
    throw new Error('Error booking room');
  }

  return await respone.json();
};
