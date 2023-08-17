//import React from 'react';
import { Link } from 'react-router-dom';
import TaskCard from '../../components/taskCard/TaskCard';

export const TaskList: React.FC = () => {

  return ( 
    <div><h1>Task List Organizer</h1>
    <TaskCard/>
    <Link to="/">Return to Home Page</Link></div>
    
    // <div><h1>Task List</h1>
    // <Link to="/">go back</Link></div>
  );
};