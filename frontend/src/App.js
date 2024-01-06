// App.js
import {React, useState, useEffect} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Profile from './components/Profile';
import Home from './components/Home';
import FindProcedure from './components/FindProcedure';
import CreateProcedureForm from './components/CreateProcedure';

const App = () => {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  
  //login
  const handleLogin = (user) => {
    setAuthenticatedUser(user);
  }

  //logout
  const handleLogout = () => {
    setAuthenticatedUser(null);
  }

  useEffect(( ) => {
    console.log("user change")
  }, [authenticatedUser])

  // router to display multiple routes
  return (
    <div className="App">
        <BrowserRouter>
          <Navbar authenticatedUser={authenticatedUser} />

          <Routes>
            <Route path="/" element={<Login onLogin={handleLogin} authenticatedUser={authenticatedUser} onLogout={handleLogout} />}/>
            <Route path="/home" element={authenticatedUser? <Home authenticatedUser={authenticatedUser}/> : <NoAccess/>} />
            <Route path="/profile" element={authenticatedUser?<Profile />: <NoAccess/>} />
            <Route path="/findprocedure" element={authenticatedUser?<FindProcedure/>: <NoAccess/>} />
            <Route path="/createprocedure" element={authenticatedUser?<CreateProcedureForm/>: <NoAccess/>}/>
          </Routes>
        </BrowserRouter>
    </div>
  );
};

const NoAccess = () => {
  return <div>YOU ARE NOT LOGGED IN. PLEASE LOG IN TO SEE ANY INFORMATION.</div>
}



export default App;
