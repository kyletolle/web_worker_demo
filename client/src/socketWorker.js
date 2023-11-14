import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const socket = io('http://localhost:8000');

socket.on('connect', () => {
  console.info('Socket connected!');
});

socket.on('server.colorsFetched', event => {
  const { colors } = event;
  postMessage({ type: 'colorsFetched', colors });
});

onmessage = e => {
  if (!socket || !socket.connected) {
    throw new Error('Socket not connected');
  }

  const { type } = e.data;
  switch (type) {
    case 'fetchColors':
      const randomNumberOfColors = Math.floor(Math.random() * 100) + 1;
      socket.emit('client.fetchColors', { numberToFetch: randomNumberOfColors });
      break;

    default:
      console.error('Invalid message type', e.data);
      throw new Error('Invalid message type');
  }
}
