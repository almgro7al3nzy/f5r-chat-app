const expressSession = require('express-session');
const mongoose       = require('mongoose');
const express        = require('express');
const http           = require('http');
const path           = require('path');
const app            = express();
const server         = http.Server(app);
const socket         = require('socket.io');
const io             = socket(server);

const passport       = require('./middlewares/authentication');
const User           = require('./models/user');
const Voice          = require('./models/voice');
const Whiteboard     = require('./models/whiteboard');

app.use(express.json({limit: '500mb'})); //this might not be so good 
app.use(expressSession({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

const mongooseOptions = { 
  useNewUrlParser: true,  
  useUnifiedTopology: true, 
  useCreateIndex: true 
};
mongoose.connect(process.env.MONGO_URI, mongooseOptions);

const PORT = process.env.PORT || 8080;

// Socket.io
io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.join('General Room');
  
  socket.emit('generated socket id', { socketId: socket.id }, () => io.in('General Room').emit('user joined', {}) );
  
  socket.on('send message', async data => {
    io.in('General Room').emit('new message', { 
      content: data.message.text, 
      createdAt: data.createdAt,
      sender: {
        displayName: data.displayName,
        photoURL: data.photoURL
      },
      channel: { _id: data.selectedChannel }
    });
  });

  socket.on('create text channel', data => {
    io.in('General Room').emit('create text channel', data);
  });

  socket.on('create voice channel', () => {
    io.in('General Room').emit('create voice channel', {});
  });

  socket.on('create whiteboard channel', () => {
    io.in('General Room').emit('create whiteboard channel', {});
  });

  socket.on('delete text channel', data => {
    io.in('General Room').emit('delete text channel', data);
  });

  socket.on('created channel', () => {
    io.in('General Room').emit('created channel', {});
  });

  socket.on('joined voice', data => {
    socket.join(data.channelName);
    io.in('General Room').emit('joined voice', {});
    socket.to(data.channelName).emit('new talker joined', { socketId: data.socketId, channelName: data.channelName });
  });

  socket.on('send offer', data => {
    io.to(data.targetSocketId).emit('request connection', { sdp: data.sdp, socketId: socket.id, channelName: data.channelName });
  });

  socket.on('send answer', data => {
    io.to(data.targetSocketId).emit('complete connection', { sdp: data.sdp, socketId: socket.id });
  });

  socket.on('send ice', data => {
    socket.to(data.channelName).emit('send ice', { socketId: socket.id, ice: data.ice, channelName: data.channelName });
  });

  socket.on('exit voice', data => {
    socket.leave(data.channelName);
    io.in('General Room').emit('exit voice', { leaver: socket.id });
  });

  socket.on('kick', data => {
    io.sockets.connected[data.socketId].leave(data.channelName);
    io.in('General Room').emit('exit voice', { leaver: data.socketId });
  });

  socket.on('refresh users', () =>{
    io.in('General Room').emit('refresh users', {});
  });

  socket.on('join whiteboard', data => {
    socket.join(data.channelName);
    io.in('General Room').emit('joined whiteboard', { socketId: socket.id });
    socket.to(data.channelName).emit('request canvas', { requester: socket.id });   
  });

  socket.on('request canvas', data => {
    io.to(data.requester).emit('receive canvas', { 
      dataURL: data.dataURL,
      bgColor: data.bgColor,
      shapes: data.shapes
    });
  });

  socket.on('drawing path', data => {
    socket.to(data.channelName).emit('drawing path', data);
  });

  socket.on('drag shape', data => {
    const { channelName, ...newData } = data;
    socket.to(data.channelName).emit('shape dragged', { ...newData });
  });

  socket.on('draw text', data => {
    const { channelName, ...newData } = data;
    io.in(data.channelName).emit('drawing text', { ...newData });
  })

  socket.on('leave whiteboard', data => {
    socket.leave(data.channelName);
    io.in('General Room').emit('leave whiteboard', {socketId: socket.id}); 
  });

  socket.on('moving mouse', data => {
    socket.to(data.channelName).emit('moving mouse', { ...data, socketId: socket.id });
  });

  socket.on('clear canvas', data => {
    io.in(data.channelName).emit('clear canvas', {});
  });

  socket.on('canvas background change', data => {
    io.in(data.channelName).emit('canvas background changed', data);
  });

  socket.on('undo', data => {
    io.in(data.channelName).emit('undid', {});
  })

  socket.on('disconnect', () => {
    console.log('a user has disconnected', socket.id);
    //lazy way done here
    Whiteboard.find({}).populate('artists').exec((error, result) => {
      if (!error) {
        result.forEach(w => {
          if (w.artists.find(a => a.socketId === socket.id)) {
            w.artists = w.artists.filter(a => a.socketId !== socket.id);
            w.save();
          }
        });
      }
    });
    
    // leave current voice channel here.
    User.findOne({ socketId: socket.id }, (error, result) => {
      if (error || !result) return;
      io.in('General Room').emit('user left', result);
      Voice.findOne({ name: result.currentVoiceChannel }, (err, result) => {
        if (!result) return;
        result.talkers.delete(socket.id);
        result.save();
      })

      User.updateOne({ socketId: socket.id }, { socketId: null, currentVoiceChannel: '' }, (err, result) => {

      });
    });
  });
});

// Controller Setup
app.use('/api',require('./controllers'))

// for production use, we serve the static react build folder
if (process.env.NODE_ENV === 'production' || true) {
  app.use(express.static(path.join(__dirname, '../client/build')));

  // all unknown routes should be handed to our react app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

server.listen(PORT,()=>console.log('listening to port:', PORT));
