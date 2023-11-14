import { parentPort } from 'worker_threads';

const fetchColor = async () => {
  const colorResponse = await fetch('https://kyletolle-random-color-api.deno.dev/')
  const colorText = await colorResponse.text();
  return colorText;
}

parentPort.on('message', async message => {
  const { type } = message;
  switch (type) {
    case 'server.fetchColor':
      const { socketId } = message;
      const color = await fetchColor();
      parentPort.postMessage({ type: 'server.colorFetched', socketId, color });
      break;

    default:
      console.error('Invalid message type', message);
      throw new Error('Invalid message type');
  }
})
