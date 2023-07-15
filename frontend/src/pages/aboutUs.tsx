//import React, { useEffect } from "react";
import React from 'react';
import { Link } from 'react-router-dom';


//remove this component entirely after demo
export const AboutUs: React.FC = () => {

    return (
        <div className="App">
          <header className="App-header">
            <p>About Us</p>
            <Link to="/">go back</Link>
          </header>
        </div>
      );
};

export default AboutUs;