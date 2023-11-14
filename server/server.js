import { Worker } from 'worker_threads';
import { Server }  from 'socket.io';

console.info('Creating a socket server');
const io = new Server({
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
});

const worker = new Worker('./worker.js');
io.on('connection', (socket) => {
  console.info('a user connected');
  socket.on('client.fetchColors', event => {
    /**
     * When we receive a message from the client to fetch colors, we want to
     * call the worker several times to do that for us.
     */
    const { numberToFetch } = event;
    socket.data.numberColorsToFetch = numberToFetch;
    socket.data.colorsFetched = [];
    for (let index = 0; index < numberToFetch; index++) {
      // Async call to worker to fetch a color
      worker.postMessage({ type: 'server.fetchColor', socketId: socket.id });
    }
  })
});

io.listen(8000);
console.info('Socket server listening on port 8000');

worker.on('message', message => {
  const { type } = message;

  switch (type) {
    case 'server.colorFetched':
      /**
       * When the server has fetched a color, we want to add it to the list of
       * colors we've fetched so far for this socket
       */
      const { color, socketId } = message;
      if (!io.sockets.sockets.has(socketId)) {
        console.info('Socket no longer connected, ignoring color');
        return;
      }

      const socket = io.sockets.sockets.get(socketId);
      socket.data.colorsFetched.push(color)
      if (socket.data.numberColorsToFetch === socket.data.colorsFetched.length) {
        socket.emit('server.colorsFetched', { colors: socket.data.colorsFetched });
      }
      break;

    default:
      console.error('Invalid message type', message);
      throw new Error('Invalid message type');
  }
});
