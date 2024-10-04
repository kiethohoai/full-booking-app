import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Layout from './layout/Layout';
import Register from './pages/Register';
import SignIn from './pages/SignIn';
import AddHotel from './pages/AddHotel';
import { useAppContext } from './contexts/AppContext';
import MyHotels from './pages/MyHotels';

const App = () => {
  const { isLoggedIn } = useAppContext();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <h1>HOMEPAGE</h1>
            </Layout>
          }
        />

        <Route
          path="/search"
          element={
            <Layout>
              <h1>SEARCH PAGE</h1>
            </Layout>
          }
        />

        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        ></Route>

        <Route
          path="/sign-in"
          element={
            <Layout>
              <SignIn />
            </Layout>
          }
        ></Route>

        {isLoggedIn && (
          <Route
            path="/add-hotel"
            element={
              <Layout>
                <AddHotel />
              </Layout>
            }
          ></Route>
        )}

        <Route
          path="/my-hotels"
          element={
            <Layout>
              <MyHotels />
            </Layout>
          }
        ></Route>

        <Route path="*" element={<Navigate to="/" />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
