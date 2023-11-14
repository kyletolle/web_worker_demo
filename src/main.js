const worker = new Worker('./src/worker.js');

// When the page has loaded, we want to run the code in this function.
window.onload = () => {
  // When number 1 and 2 from index.html change, we want to trigger a message to the worker. When the worker responds, we want to update the result in index.html.
  const number1 = document.getElementById('number1');
  const number2 = document.getElementById('number2');
  const result = document.getElementById('result');
  console.info("What is number1?", number1);
  console.info("What is number2?", number2);
  console.info('What is result?', result);

  number1.addEventListener('change', () => {
    worker.postMessage([number1.value, number2.value]);
  });

  number2.addEventListener('change', () => {
    worker.postMessage([number1.value, number2.value]);
  });

  worker.onmessage = e => {
    console.info('Message received from worker', e.data);
    result.value = e.data;
  }

  worker.postMessage([number1.value, number2.value]);
}
