import React, { useEffect } from 'react'
import { Route, Routes, useLocation } from "react-router-dom"

// Pages
import Error from './pages/Error';
import Home from './pages/Home';
import ProductDetail from './pages/productDetails'; 
import NextPage from './pages/NextPage';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const NoNavbarRoutes = ["/login", "/signup"];
  const NoFooterRoutes = ["/login", "/signup"];

  return (
    <div>
      {!NoNavbarRoutes.includes(pathname) && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route exact path='/' element={<Home />} /> 
        <Route exact path='/next-page' element={<NextPage />} /> 

        {/* Product Detail Dynamic Route */}
        <Route path='/product/:id' element={<ProductDetail />} /> 

        {/* Error Route For 404 */}
        <Route path='*' element={<Error />} />
      </Routes>
      {!NoFooterRoutes.includes(pathname) && <Footer />}
    </div>
  )
}

export default App
