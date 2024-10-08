import { Link } from 'react-router-dom';
import SignOutButton from './SignOutButton';
import { useAppContext } from '../contexts/useAppContext';

const Header = () => {
  const { isLoggedIn } = useAppContext();

  return (
    <div className="bg-blue-800 py-6">
      <div className="container mx-auto flex justify-between px-6">
        <span className="text-3xl text-white font-bold tracking-tight hidden md:block">
          <Link to="/">MernHoliday.Com</Link>
        </span>

        <span className="flex space-x-2 vm:space-x-6">
          {isLoggedIn ? (
            <>
              <Link
                to="/my-bookings"
                className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
              >
                My Bookings
              </Link>
              <Link
                to="/my-hotels"
                className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
              >
                My Hotel
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link
                to="/sign-in"
                className="flex items-center text-blue-600 px-3 py-1 font-bold hover:bg-gray-100 hover:text-blue-500 bg-white rounded-sm"
              >
                Sign in
              </Link>
            </>
          )}
        </span>
      </div>
    </div>
  );
};

export default Header;
