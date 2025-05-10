import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProductDetails from './pages/ProductDetails';
import PostAd from './pages/PostAd';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './components/AdminDashboard';
import ContactForm from './components/ContactForm';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';

// Create a NavbarWrapper component to handle the conditional rendering
const NavbarWrapper = () => {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/signup'];

  if (hideNavbarPaths.includes(location.pathname)) {
    return null;
  }

  return <Navbar />;
};

// Create a FooterWrapper component to handle the conditional rendering
const FooterWrapper = () => {
  const location = useLocation();
  const hideFooterPaths = ['/login', '/signup'];

  if (hideFooterPaths.includes(location.pathname)) {
    return null;
  }

  return <Footer />;
};

const ProtectedRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};


const AdminRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);

  if (!user || !user.isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <NavbarWrapper />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/contact/:sellerId/:adId" element={
              <ProtectedRoute>
                <ContactForm />
              </ProtectedRoute>
            } />
            <Route path="/post" element={
              <ProtectedRoute>
                <PostAd />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            {/* ... other routes ... */}
          </Routes>
        </div>
        <FooterWrapper />
      </div>
    </Router>
  );
}

export default App;


