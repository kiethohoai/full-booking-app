import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Layout from './layout/Layout';
import Register from './pages/Register';
import SignIn from './pages/SignIn';

const App = () => {
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

        <Route path="*" element={<Navigate to="/" />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
