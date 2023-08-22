//import React, { useEffect } from "react";
import React from 'react';
import PomodoroTab from '../../components/pomodoro/PomodoroTab';
import "./pomodoro.css";
import { Link } from 'react-router-dom';


//remove this component entirely after demo
export const Pomodoro: React.FC = () => {

    return (
      <div>
        <h1>Pomodoro</h1>

        <div className = "taskPomo">
            <div className= "taskList">
                <h1>Task List</h1>
                <p>Sleep</p>
            </div>
            <div className = "clock">
                <PomodoroTab/>
            </div>
        </div>
        <a href="/"><button className="btn btn-primary">Return to Home</button></a>
      </div>
      );
};

export default Pomodoro;