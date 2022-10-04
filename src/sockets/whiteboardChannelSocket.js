import ToolKit from '../components/ChatPage/whiteboard/ToolKit';
import server from '../apis/server';



const whiteboardChannelSocket = (socket, channelContext, whiteboardContext) => {

  const { appendCursor, shapesRef, setBgColor, onBackgroundChange, cacheShape, dragShape, redrawCanvas, setWhiteboards } = whiteboardContext;
  const { fetchWhiteboardChannels, selectedChannelRef, setWhiteboardChannels } = channelContext;



  socket.on('drawing path', data => {
    const { x0, y0, x, y, shapeIndex, strokeColor, lineWidth, lineStyle, type } = data;
    cacheShape(x0, y0, x, y, shapeIndex, strokeColor, lineWidth, lineStyle, type);
  });

  socket.on('shape dragged', data => {
    const { shapeIndex, x0, y0, x, y } = data;
    dragShape(shapeIndex, x0, y0, x, y);
  });

  socket.on('joined whiteboard', data => {
    fetchWhiteboardChannels();
    if (selectedChannelRef.current.type === 'whiteboard' && data.socketId !== socket.id)
      appendCursor(data);
  });

  socket.on('leave whiteboard', data => {
    fetchWhiteboardChannels();
    const cursor = document.querySelector(`#container-${data.socketId}`); 
    if (cursor) cursor.remove();
  });

  socket.on('request canvas', data => {
    let bgColor = null;

    setBgColor(prevBgColor => bgColor = prevBgColor);

    socket.emit('request canvas', {
      requester: data.requester,
      dataURL: document.querySelector('canvas').toDataURL(),
      bgColor: '#' + bgColor,
      shapes: shapesRef.current
    });
  });

  socket.on('receive canvas', data => {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');
    const dataURL = data.dataURL;
    const img = new Image();

    canvas.style.background = data.bgColor;
    console.log('data shapes', data.shapes);
    shapesRef.current = data.shapes;

    redrawCanvas();
    setBgColor(data.bgColor.slice(1));
  });

  socket.on('moving mouse', data => {
    const cursor = document.getElementById(`cursor-${data.socketId}`);
    const container = document.getElementById(`container-${data.socketId}`);
    const name = document.getElementById(`name-${data.socketId}`);
    name.innerHTML = data.displayName;
    cursor.setAttribute('src', ToolKit.USER_POINTER);
    cursor.setAttribute('width', '30px');
    cursor.setAttribute('height', 'auto');
    container.style.top = `${data.y}px`;
    container.style.left = `${data.x}px`;
  });

  socket.on('clear canvas', () => {
    const canvas = document.querySelector('canvas').getBoundingClientRect();
    const context = document.querySelector('canvas').getContext('2d');
    context.clearRect(0,0,canvas.width, canvas.height);
    shapesRef.current = [];
  });

  socket.on('canvas background changed', data => {
    onBackgroundChange(data.color);
  });

  socket.on('undid', () => {
    shapesRef.current.pop();
    redrawCanvas();
  });

  socket.on('drawing text', data =>{
    const { x0, y0, x1, y1, shapeIndex, color, fontSize, fontStyle, type, text } = data;

    if (text.trim().length === 0) {
      shapesRef.current.splice(shapeIndex, 1);
      redrawCanvas();
      return;
    }

    cacheShape(x0, y0, x1, y1, shapeIndex, color, fontSize, fontStyle, type, text);
  });

  socket.on('create whiteboard channel', () => {
    server.get('/whiteboard').then(response => {
      setWhiteboardChannels(response.data);
    })
  });

};

export default whiteboardChannelSocket;