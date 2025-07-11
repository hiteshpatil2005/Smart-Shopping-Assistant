import React from 'react'
import { Route, Routes, useLocation, useNavigate } from "react-router-dom"

//Pages
import Error from './pages/Error';
import Home from './pages/Home';

//Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NextPage from './pages/NextPage';

const App = () => {
  const pathname = useLocation().pathname;
  const NoNavbarRoutes = ["/login", "/signup"];
  const NoFooterRoutes = ["/login", "/signup"];

  return (
    <div>
      {!NoNavbarRoutes.includes(pathname) && <Navbar/>}
      <Routes>
        {/* Public Routes  */}
        <Route exact path='/' element={<Home />} /> 
        <Route exact path='/next-page' element={<NextPage />} /> 

        {/* Error Route For 404 Eror  */}
        <Route exact path='*' element={<Error />} />
      </Routes>
      {!NoFooterRoutes.includes(pathname) && <Footer/>}
    </div>
  )
}

export default App
