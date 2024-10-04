import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import * as apiClient from '../api-client';
import ManageHotelForm from '../forms/ManageHotelForm/ManageHotelForm';

const EditHotel = () => {
  const { hotelId } = useParams();
  const { data: hotel } = useQuery(
    'fetchMyHotelById',
    () => apiClient.fetchMyHotelById(hotelId || ''),
    {
      enabled: !!hotelId, //Check if hotelId is not null & undefined
    },
  );

  return <ManageHotelForm hotel={hotel} />;
};

export default EditHotel;
