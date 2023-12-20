import React, {useEffect, useState, ChangeEvent} from 'react';
import './App.css';
import { Box } from "./components/box/box";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Button, Switch} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { AboutUs } from "./pages/aboutUs/aboutUs";
import { TaskList } from "./pages/taskList/taskList";
import { Pomodoro } from "./pages/pomodoro/pomodoro";
import { Home } from "./pages/Home/Home";

//import { useState } from 'react';
//import axios from 'axios';


export const App: React.FC = () => {
  const [modeFlag, setModeFlag] = useState(true);
  //If you comment out, imma lose moolah -> dont touch my no-no rectangle, its an infinite loop of creating users
  /* var [userID, setUserID] = useState();

  axios.post(`http://localhost:4000/user/create`, {
    username: "test",
    password: "password"
  }).then((body) => {
      console.log(body);
      setUserID(body.data.userid);
      console.log("Successfully made a user");

  }), (err : any) => {
    console.log("Error: " + err);
  }; */
  const changeMode = async() => {
    if(modeFlag === true) { //If light mode, change to dark mode
      const content = document.getElementsByClassName("light-mode");
      content[0].className = "dark-mode";
    } 
    else { //If dark mode, change to light mode
      const content = document.getElementsByClassName("dark-mode");
        content[0].classList.replace("dark-mode","light-mode");
    }
    setModeFlag(!modeFlag);
   }

  return (
    <div className = 'everything'>
      <div className= 'light-mode'>
        <div className='toggle-mode'>
          <Switch inputProps={{ 'aria-label': 'Switch Mode' }} onChange={() => changeMode()}/>
        </div>
        
        <Router>
          <Routes>
            <Route path= "aboutUsPage" element = {<AboutUs/>}/>
            <Route path= "taskListPage" element = {<TaskList/>}/>
            <Route path= "pomodoroPage" element = {<Pomodoro/>}/>
            <Route path="/" element={<Home/>}/>
          </Routes>
        </Router>
      </div>
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

export default App;
