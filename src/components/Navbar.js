import React, { useState, useContext, useEffect } from 'react';
import '../styles/Navbar.css'; // Import the CSS file for Navbar
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import { API_URL } from '../api';

const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [moviesDropdown, setMoviesDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [theatres, setTheatres] = useState([]); // State to hold the list of theatres

  const  isLoggedIn  = useContext(false); // Get state from context //AuthContext

  // Fetch all theatres from the backend
  useEffect(() => {
    const fetchTheatres = async () => {
      try {
        const response = await fetch(API_URL+'/theatres'); // Replace with your actual API endpoint
        const data = await response.json();
        console.log(data)
        setTheatres(data);
      } catch (error) {
        console.error('Error fetching theatres:', error);
      }
    };

    fetchTheatres();
  }, []);

  // Effect to control profile visibility based on login state
  useEffect(() => {
    const profilePic = document.getElementById("profilePic");
    const userButton = document.getElementById("userButton");

    if (isLoggedIn) {
      profilePic.style.display = "inline";
      userButton.style.padding = "3px";
      userButton.style.borderRadius = "50%";
      userButton.textContent = "";
    } else {
      profilePic.style.display = "none";
      userButton.textContent = "Profile";
    }
  }, [isLoggedIn]);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
    // Close dropdowns when toggling menu
    setMoviesDropdown(false);
    setProfileDropdown(false);
  };

  return (
    <div className="navbar-container">
      <div className="navbar">
        {/* Hamburger Menu */}
        <div className={`hamburger ${menuActive ? 'active' : ''}`} onClick={toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>

        {/* Logo */}
        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="https://static.vecteezy.com/system/resources/thumbnails/012/657/549/small/illustration-negative-film-reel-roll-tapes-for-movie-cinema-video-logo-vector.jpg" alt="Logo" />
          <p>XYZ MOVIES</p>
        </div>

        {/* Navigation Menu */}
        <div className={`menu ${menuActive ? 'active' : ''}`}>
          <Link to='/' className="master">Home</Link>

          {/* Dynamic Theatre Dropdown */}
          <div className="dropdown">
            <div className="master">Theatres</div>
            {/* {console.log(theatres)} */}
            <div className={`dropdown-content ${moviesDropdown ? 'show' : ''}`}>
              {theatres && theatres.map((theatre) => (
                <Link key={theatre._id} to={`/${theatre.theatrename}`}>
                  {theatre.theatrename.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="dropdown">
            <div className="master">Login/Profile</div>
            <div className={`dropdown-content ${profileDropdown ? 'show' : ''}`}>
              {isLoggedIn ? (
                <>
                  <Link to="/">Profile</Link>
                  <Link to="/">Settings</Link>
                  <Link to="/logout">Logout</Link> {/* Logout link */}
                </>
              ) : (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/register">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>


        {/* Profile Section */}
        <div className="profile">
          <img id="profilePic" src="https://images.hindustantimes.com/img/2024/07/17/1600x900/kalki_1721207150115_1721207150501.jpg" alt="Profile" />
          <Link id="userButton" to="/">Profile</Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
