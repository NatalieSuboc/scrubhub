import React from 'react';
import './App.css';
import { Box } from "./components/box";
import Timer from "./components/pomodoro/Timer";
import PomodoroTab from './components/pomodoro/PomodoroTab';
import { useNavigate } from 'react-router-dom';

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
    
    return (
      <div className="App">
          <h1>ScrubHub (Temporary Name)</h1>
          {/* <a href="taskList.html"><button className="btn btn-primary">Task List</button></a> */}
          <button onClick={goToAboutUs}> About Us </button>
          {/* <a href="aboutUs.html"><button className="btn btn-primary">About Us</button></a> */}
          <button onClick={gotToTaskList}>Task List </button>
        {/* </header> */}
        <Box/>
        <br></br>
        <PomodoroTab/>
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
