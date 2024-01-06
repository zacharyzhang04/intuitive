import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Login = ({ onLogin, onLogout }) => {
  const { user, isAuthenticated } = useAuth0();
  useEffect(() => {
    // login
    if (isAuthenticated) {
      const userEmail = user.email;
      console.log(userEmail);
      onLogin(userEmail);
    } else {
      // logout
      onLogout();
      console.log("Logged Out");
    }
  }, [isAuthenticated,onLogin, onLogout, user]);


  return ( isAuthenticated?
    <div>
        <p>You are already logged in.</p>
        <LogoutButton></LogoutButton>
      </div>
      :
  
    <div>
      <h2>Login Page</h2>
      <p>Log in to access the application.</p>
      <LoginButton></LoginButton>
    </div>
  );

  
};

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};




const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
      Log Out
    </button>
  );
};

export default Login;