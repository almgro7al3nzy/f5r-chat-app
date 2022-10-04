import React from 'react';
import Paper from '@material-ui/core/Paper';

import ChannelGroup from './ChannelGroup';
import UserControl from './UserControl';

const SidebarContainer = () => {
  const arrowDown = () => <svg width="18" height="18" className="button-1w5pas"><g fill="none" fill-rule="evenodd"><path d="M0 0h18v18H0"></path><path stroke="currentColor" d="M4.5 4.5l9 9" stroke-linecap="round"></path><path stroke="currentColor" d="M13.5 4.5l-9 9" stroke-linecap="round"></path></g></svg>;
  
  return(
    <>
      <Paper>
        <div className="primary-color group-title">
          <span className="group-name">Indecent Group</span>
          <span>{arrowDown()}</span>
          {/* <button onClick={() => auth.signOut()}>Signout</button> */}
        </div>
        <ChannelGroup />
        <UserControl/>
      </Paper>
    </>
  )
}

export default SidebarContainer;