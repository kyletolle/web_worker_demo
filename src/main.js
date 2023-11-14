const worker = new Worker('./src/worker.js');

// When the page has loaded, we want to run the code in this function.
window.onload = () => {
  // When number 1 and 2 from index.html change, we want to trigger a message to the worker. When the worker responds, we want to update the result in index.html.
  const number1 = document.getElementById('number1');
  const number2 = document.getElementById('number2');
  const result = document.getElementById('result');

  const changeHandler = () => {
    worker.postMessage([number1.value, number2.value, calculation.value]);
  }

  // Read from the calculation select to get what operation we want to perform.
  const calculation = document.getElementById('calculation');
  number1.addEventListener('change', changeHandler);
  number2.addEventListener('change', changeHandler);
  calculation.addEventListener('change', changeHandler);
  worker.onmessage = e => {
    console.info('Message received from worker', e.data);
    result.value = e.data;
  }

  changeHandler();
}
