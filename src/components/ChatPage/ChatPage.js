import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import React from 'react';

import useChat from '../../hooks/useChat';
import '../../styles/ChatPage.css';
import ChannelHeader from './ChannelHeader';
import ActiveMemberBar from './ActiveMemberBar';
import SidebarContainer from './sidebar/SidebarContainer';

const ChatPage = () => {
  const [renderMain] = useChat();

  return (
    <div>
      <Grid container spacing={0}>
        <Grid item className="sidebar" sm={4} md={2}>
          <Hidden xsDown>
            <SidebarContainer />
          </Hidden>
        </Grid>

        <Grid item className="main-chat" xs={12} sm={8} md={10}>
          <ChannelHeader />

          <Grid className="below-header-container" container spacing={0}>
            
            <Grid className="message-ui" item xs={12} sm={12} md={10}>
              { renderMain() }
            </Grid>
            <Grid item sm={3} md={2}>
              <Hidden smDown>
                <ActiveMemberBar />
              </Hidden>
            </Grid>
            
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default ChatPage;