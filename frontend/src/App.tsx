import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout';

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
      </Routes>
    </Router>
  );
};

export default App;
