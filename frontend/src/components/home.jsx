import React from 'react';
import Navbar from './navbar';
import backgroundImage from '../assets/mainwallpaper.png';

const Home = () => {
  return (
    <>
      <Navbar />
      <img
        src={backgroundImage} 
        alt="Main Wallpaper" 
        style={{
          objectFit: 'cover', 
          width: '100%',      
          height: '100vh',   
        }}
      />
    </>

    


  )
}

export default Home