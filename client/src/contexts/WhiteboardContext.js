import React, { useRef, useState } from 'react';

import ToolKit from '../components/ChatPage/whiteboard/ToolKit';
import server from '../apis/server';

const WhiteboardContext = React.createContext();

export const WhiteboardProvider = ({ children }) => {
  const contextRef = useRef(null);
  /* 
      Shapes Def [{ 
        x_0: number,
        y_0: number,
        points: [{ x: number, y: number }, ...], 
        color: string, 
        width: number,
        style: string,
        maxX: number,
        minX: number,
        minY: number,
        maxY: number,
        type: string ['path' | 'text' | 'rectangle' | 'circle' | 'line']
        text: string
      }]
  */
  const shapesRef = useRef([]);
  const [whiteboards, setWhiteboards] = useState([]);
  const [color, setColor] = useState('000000');
  const [bgColor, setBgColor] = useState('40444b');
  const [hexError, setHexError] = useState(false);
  const [tool, setTool] = useState({
    lineWidth: 2,
    name: 'tool-pointer',
    cursorImg: ToolKit.POINTER_ICON,
    lineStyle: 'solid',
    fontSize: '12px',
    fontFamily: 'whitney-medium'
  });

  const onBackgroundChange = color => {
    setHexError(false);
    setBgColor(color);
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');
    const canvasRect = canvas.getBoundingClientRect();
    context.clearRect(0, 0, canvasRect.width, canvasRect.height);
    document.querySelector('canvas').style.background = '#' + color;   
  };

  const changeStrokeStyle = strokeStyle => {
    setTool(prevTool => {
      return { ...prevTool, lineStyle: strokeStyle }
    });
  };

  const getSegments = strokeStyle => {
    switch (strokeStyle) {
      case 'solid':
        return [];
      case 'dashed':
        return [20, 15];
      case 'dotted':
        return [1, 10];
      default:
        return [];
    }
  }

  const onStrokeStyleChange = strokeStyle => {
    const ctx = document.querySelector('canvas').getContext('2d');
    changeStrokeStyle(strokeStyle);
    ctx.setLineDash(getSegments(strokeStyle));
  }

  const changeStrokeWidth = strokeWidth => {
    setTool(prevTool => {
      return { ...prevTool, lineWidth: strokeWidth };
    });
  };

  const onStrokeWidthChange = width => {
    changeStrokeWidth(width);
  };

  const changeFontSize = size =>{
    setTool(prevTool => {
      return { ...prevTool, fontSize: size + 'px' };
    });
  };


  /*
    Used when:
      - Exit whiteboard channel. (useWhiteboard.js)
      - Join another whiteboard channel while inside a whiteboard channel. (useChannelGroup.js)
  */
  const removeAllCursors = () =>
    document.querySelectorAll('.cursor-container').forEach(n => n.remove());


  const cacheShape = (x0, y0, x1, y1, i, color, width, style, type, text = '') => {
    if (!shapesRef.current[i]) {
      console.log('current shapes', shapesRef.current);
      console.log('shape index', i);
      console.log('current shape', shapesRef.current[i]);
      console.log('drawing:', { 
        x_0: 0, 
        y_0: 0, 
        points: [{ x: x0, y: y0 }], 
        color, 
        width, 
        style, 
        minX: x0, 
        maxX: x1, 
        minY: y0, 
        maxY: y1,
        type,
        text
      })
      shapesRef.current[i] = { 
        x_0: 0, 
        y_0: 0, 
        points: [{ x: x0, y: y0 }], 
        color, 
        width, 
        style, 
        minX: x0, 
        maxX: x1, 
        minY: y0, 
        maxY: y1,
        type,
        text
      };
    } else {
      const { minX, maxX, minY, maxY, x_0, y_0 } = shapesRef.current[i];

      shapesRef.current[i].minX = Math.min(minX, x1);
      shapesRef.current[i].maxX = Math.max(maxX, x1);
      shapesRef.current[i].minY = Math.min(minY, y1);
      shapesRef.current[i].maxY = Math.max(maxY, y1);

      shapesRef.current[i].points.push({ x: x_0 + x1, y: y_0 + y1 });
    }
    console.log('shapes', shapesRef.current);

    redrawCanvas();
  }

  const defineShape = shape => {
    const ctx = document.querySelector('canvas').getContext('2d');

    ctx.beginPath();
    ctx.moveTo(shape.x_0 + shape.points[0].x, shape.y_0 + shape.points[0].y);

    for (let i = 1; i < shape.points.length; ++i) {
      const point = shape.points[i];
      ctx.lineTo(shape.x_0 + point.x, shape.y_0 + point.y);
    }
  }

  const defineBoundingRect = shape => {
    const ctx = document.querySelector('canvas').getContext('2d');
    // a  b
    // c  d
    const padding = { top: 10 + (shape.width / 2), bottom: 10, left: 10, right: 10 };
    const a = { x: shape.minX - padding.left, y: shape.minY - padding.top };
    const b = { x: shape.maxX + padding.right, y: shape.minY - padding.top };
    const c = { x: shape.minX - padding.left, y: shape.maxY + padding.bottom };
    const d = { x: shape.maxX + padding.right, y: shape.maxY + padding.bottom };

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(d.x, d.y);
    ctx.lineTo(c.x, c.y);
    ctx.closePath();
  }

  const redrawCanvas = () => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    console.log('redrawing canvas current shapes:', shapesRef.current)
    for (let shape of shapesRef.current) {
      if (shape.type === 'path') {
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = shape.width;
        ctx.setLineDash(getSegments(shape.style));
        defineShape(shape);
        ctx.stroke();
      } else if (shape.type === 'text') {
        const texts = shape.text.split('\n');
        let lineHeight = shape.width;
        const textCursorOffset = 0;
        ctx.font = `${lineHeight}px whitney-medium`;
        ctx.textBaseline = 'middle';
        for (let i = 0; i < texts.length; ++i) {
          ctx.fillText(texts[i], shape.x_0 + shape.points[0].x, shape.y_0 + textCursorOffset + (shape.points[0].y + i * lineHeight));
        }
      }
    }
  }
  
  const drawBoundingRect = shapeIdx => {
    const ctx = document.querySelector('canvas').getContext('2d');
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000';
    ctx.setLineDash([10, 10]);
    defineBoundingRect(shapesRef.current[shapeIdx]);
    ctx.stroke();
  }

  const isMouseOnShape = (x, y) => {
    for (let i = 0; i < shapesRef.current.length; ++i) {
      const shape = shapesRef.current[i];
      const padding = { top: 10, bottom: 10, left: 10, right: 10 };
      const a = { x: shape.minX - padding.left, y: shape.minY - padding.top };
      const b = { x: shape.maxX + padding.right, y: shape.minY - padding.top };
      const c = { x: shape.minX - padding.left, y: shape.maxY + padding.bottom };
      const d = { x: shape.maxX + padding.right, y: shape.maxY + padding.bottom };

      if (x >= a.x && x <= b.x && y >= a.y && y <= c.y)
        return i;
    }
    return -1;
  }

  const draw = (x0, y0, x1, y1, shapeIndex, strokeColor, lineWidth, lineStyle) => {
    if (contextRef.current) {
      cacheShape(x0, y0, x1, y1, shapeIndex, strokeColor, lineWidth, tool.lineStyle)
      redrawCanvas();
      // if (!emit) return;

      // socket.emit("drawing path", { x0, y0, x1, y1, lineWidth, color, channelName });
    }
  }

  const appendCursor = a => {
    const container = document.createElement("div");
    const img = document.createElement("IMG");
    const name = document.createElement('div');
    container.setAttribute('id', `container-${a.socketId}`);
    container.setAttribute('class', 'cursor-container');
    img.setAttribute('id', `cursor-${a.socketId}`);
    name.setAttribute('id', `name-${a.socketId}`);
    name.setAttribute('class', 'cursor-nametag');
    container.appendChild(img);
    container.appendChild(name);
    document.querySelector('.whiteboard-canvas').appendChild(container);
  }

  const leaveWhiteboard = (socket, selectedChannel) => {
    const canvas = document.querySelector('canvas');

    const requestBody = {
      name: selectedChannel.name,
      dataURL: null,
      bgColor: '#' + bgColor,
      shapes: shapesRef.current
    };

    canvas.getContext('2d').clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    server.delete('/whiteboard/leave', { data: requestBody })
      .then(() => socket.emit('leave whiteboard', { channelName: selectedChannel.name }))
    // .catch(onServerFailure);
  }

  const dragShape = (shapeIdx, x0, y0, x1, y1) => {
    const xOffset = x1 - x0;
    const yOffset = y1 - y0;
    
    // Update shape cooridnates.
    shapesRef.current[shapeIdx].x_0 += xOffset;
    shapesRef.current[shapeIdx].y_0 += yOffset;

    // Update bounding rectangle coordinates.
    shapesRef.current[shapeIdx].minX += xOffset;
    shapesRef.current[shapeIdx].maxX += xOffset;
    shapesRef.current[shapeIdx].minY += yOffset;
    shapesRef.current[shapeIdx].maxY += yOffset;

    redrawCanvas();
  }

  return <WhiteboardContext.Provider value={{
    contextRef,
    draw,
    whiteboards,
    setWhiteboards,
    color,
    setColor,
    tool,
    setTool,
    bgColor,
    setBgColor,
    removeAllCursors,
    appendCursor,
    leaveWhiteboard,
    cacheShape,
    redrawCanvas,
    isMouseOnShape,
    shapesRef,
    onStrokeWidthChange,
    onStrokeStyleChange,
    drawBoundingRect,
    dragShape,
    onBackgroundChange,
    hexError,
    setHexError,
    changeFontSize
  }}>
    {children}
  </WhiteboardContext.Provider>
}

export default WhiteboardContext;