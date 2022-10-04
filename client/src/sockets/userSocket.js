import server from '../apis/server';

const userSocket = (socket, userContext, channelContext, logsContext, allUsersContext) => {
  const { user } = userContext;
  const { fetchAllUsers } = allUsersContext;
  const { fetchVoiceChannels, fetchWhiteboardChannels } = channelContext;

  socket.on('generated socket id', async ({ socketId }, announceJoin) => {
    await server.put('/user', { email: user.email, socketId: socketId });
    announceJoin();
  });

  socket.on('user left', () => {
    fetchAllUsers();
    fetchVoiceChannels();
    fetchWhiteboardChannels();
  });

  socket.on('user joined', ()=> {
    fetchAllUsers();
  });

  socket.on('refresh users', () => {
    fetchAllUsers();
  });
}

export default userSocket;