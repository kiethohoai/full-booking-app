import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="bg-blue-800 py-6">
      <div className="container mx-auto flex justify-between px-6">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">MernHoliday.Com</Link>
        </span>

        <span className="flex space-x-2">
          <Link
            to="/sign-in"
            className="flex items-center text-blue-600 px-3 font-bold hover:bg-gray-100 hover:text-blue-500 bg-white rounded-sm"
          >
            Sign in
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Header;
