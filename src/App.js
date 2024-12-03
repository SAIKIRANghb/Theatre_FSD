import React, { Fragment, useEffect, useState } from 'react'; // Correct imports
import Navbar from './components/Navbar';
import MovieSlider from './components/MovieSlider';
import Footer from './components/Footer';
import Theatres from './components/Theatres';
import './App.css'; // Import the global CSS file
import Booking from './components/Booking';
import AdminApp from './components/adminApp';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import MoviePage from './components/MoviePage';
import { API_URL } from './api';

const App = () => {
  const [theatres, setTheatres] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchAllTheatres = async () => {
      try {
        const response = await fetch(API_URL+'/theatres');
        const data = await response.json();
        setTheatres(data);
      } catch (error) {
        console.error('Error fetching all theatres:', error);
      }
    };
    fetchAllTheatres();
  }, []);
  
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
    <div className='Thbody'>
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        {/* {console.log(theatres)} */}
        {theatres && theatres.map(theatre => (
          <Fragment key={theatre._id}>
            {console.log(theatre.theatrename)}
            <Route path={`/${theatre.theatrename}`} element={<Theatres theatre={theatre.theatrename} />} />
            <Route path={`/${theatre.theatrename}/:movieId/:screen/:timings`} element={<Booking theatre={theatre.theatrename} theatreId={theatre._id} />} />
            <Route path={`/${theatre.theatrename}/:movieId`} element={<MoviePage theatre={theatre.theatrename} />} />
          </Fragment>
        ))}

        <Route path="/*" element={<div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100vh'}}><h1>PAGENOT FOUND</h1></div>} />
        <Route path="/" element={
          <>
            <MovieSlider />
          </>
        } />
      </Routes>
      {!isAdminRoute && <Footer />}
      </div>
    </>
  );
};

const Main = () => (
  <Router>
    <App />
  </Router>
);

export default Main;

