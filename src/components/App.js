import React from 'react';

import { Router, Switch } from 'react-router-dom';
import { UserProvider } from '../contexts/UserContext';
import { SocketProvider } from '../contexts/SocketContext';
import { LogsProvider } from '../contexts/LogsContext';
import { AllUsersProvider } from '../contexts/AllUsersContext';
import { ChannelProvider } from '../contexts/ChannelContext';
import { WebRTCProvider } from '../contexts/WebRTCContext';
import { WhiteboardProvider } from '../contexts/WhiteboardContext';
import { LeftIslandProvider } from '../contexts/LeftIslandContext';

import '../styles/App.css';
import history from '../utilities/history';

import ChatPage from "./ChatPage/ChatPage";
import HomePage from './HomePage';
import ProfilePage from './ProfilePage';
import SigninPage from "./SigninPage";
import SignOutPage from "./SignoutPage";
import SignupPage from "./SignupPage";

import ProtectedRoute from './hocs/ProtectedRoute';
import GuestRoute from './hocs/GuestRoute';

import useApp from '../hooks/useApp';


const App = () => {
  useApp();

  return (
    <Router history={history}>
      <Switch>
        <GuestRoute path="/signin" component={SigninPage} />
        <GuestRoute path="/signup" component={SignupPage}/>
        <ProtectedRoute path ="/profile" component={ProfilePage} />
        <ProtectedRoute path="/chat" component={ChatPage} />
        <GuestRoute path="/" component={SignupPage} />
        <ProtectedRoute path="/signout" component={SignOutPage} />
      </Switch>
    </Router>
  );
}

export default () => (
  <LeftIslandProvider>
    <WhiteboardProvider>
      <WebRTCProvider>
        <ChannelProvider>
          <AllUsersProvider>
            <LogsProvider>
              <SocketProvider>
                <UserProvider>
                  <App />
                </UserProvider>
              </SocketProvider>
            </LogsProvider>
          </AllUsersProvider>
        </ChannelProvider>
      </WebRTCProvider>
    </WhiteboardProvider>
  </LeftIslandProvider>
);

