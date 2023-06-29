import React from 'react';
import './App.css';
import { Box } from "./components/box";
import { useState } from 'react';
import axios from 'axios';


export const App: React.FC = () => {

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

  return (
    <div>
      <Box/>
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
