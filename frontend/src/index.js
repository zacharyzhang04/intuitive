import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import auth0Config from './config/authconfig';

// auth0 provider to log in / log out
ReactDOM.render(
  <Auth0Provider
    domain={auth0Config.domain}
    clientId={auth0Config.clientId}
    redirectUri={auth0Config.redirectUri}
  >
    <App />
    
  </Auth0Provider>,
  document.getElementById('root')
);