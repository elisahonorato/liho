import React, { useEffect, useRef } from 'react';

const WebSocketClient = () => {
  const ws = useRef(null);
  console.log("hello")
  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:3000/ws');

    ws.current.onopen = () => {
      ws.send('Hello from the React app!');
      console.log('WebSocket connection opened');
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.current.onmessage = (event) => {
      console.log(event.data);
    };

    return () => {
      ws.current.close();
    };
  }, []);

  return null;
};

export default WebSocketClient;