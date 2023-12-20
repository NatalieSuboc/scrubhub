import React from 'react';
import '../../App.css';
import './Home.css'
import { Box } from "../../components/box/box";
// import Timer from "../../components/pomodoro/Timer";
// import PomodoroTab from '../../components/pomodoro/PomodoroTab';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
// import  Button  from "../../components/button/Button";

//import { useState } from 'react';
//import axios from 'axios';


export const Home: React.FC = () => {

    const navigate = useNavigate();
  
    const goToAboutUs = () => {
    
      // This will navigate to second component
      navigate('aboutUsPage'); 
    };
    const gotToTaskList = () => {
    
      // This will navigate to first component
      navigate('taskListPage'); 
    };

    const gotToPomodoro = () => {
    
      // This will navigate to first component
      navigate('pomodoroPage'); 
    };
    
    return (
      <div className="App">
          <h1>ScrubHub (Temporary Name)</h1>

          <Button variant="outlined" className="NavButton" onClick={goToAboutUs}>About Us</Button>

          <Button variant="outlined" className="NavButton" onClick={gotToTaskList}>Task List</Button>

          <Button variant="outlined" className="NavButton" onClick={gotToPomodoro}>Pomodoro</Button>
          {/* <Button 
            margin="5px"
            border="none"
            color="pink"
            height = "200px"
            onClick={() => console.log("You clicked on the pink circle!")}
            // radius = "50%"
            width = "200px"
            children = "I'm a pink circle!"
          /> */}
        {/* </header> */}
        <Box/>
        <br></br>
        {/* <PomodoroTab/> */}
      </div>
    );
};

/*
*  axios.get(`http://localhost:4001/user/get`, {
    headers: {
      'token': localStorage.getItem("token"),
    }
  }).then((body) => {
        // console.log(body);
        console.log(body.data);
        //user1 = body.data;
        //curGameId = body.data.currentGameID;
        setCurGameId(body.data.currentGameID);
        console.log("Ran");
        setUsername1(body.data.username);
        //username1 = body.data.username;

      }, (err) => {
        console.log("Error: ", err);
  });
*/


//This was the template code
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default Home;
