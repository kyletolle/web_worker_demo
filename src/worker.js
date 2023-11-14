onmessage = e => {
  console.info('Worker received message from main', e.data);
  const workerResult = e.data[0] * e.data[1];
  console.info('Worker posting message back to main');
  postMessage(workerResult);
}
