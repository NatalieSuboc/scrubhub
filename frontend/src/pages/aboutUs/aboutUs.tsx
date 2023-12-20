//import React, { useEffect } from "react";
import React from 'react';
import { Link } from 'react-router-dom';
import "./aboutUs.css";


//remove this component entirely after demo
export const AboutUs: React.FC = () => {

    return (
      <div>
        <h1>About Us</h1>
        <a href="/"><button className="btn btn-primary">Return to Home</button></a>
      </div>

        // <div className="App">
        //   <header className="App-header">
        //     <p>About Us</p>
        //     <Link to="/">go back</Link>
        //   </header>
        // </div>
      );
};

export default AboutUs;