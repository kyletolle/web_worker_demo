import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const worker = new Worker('./src/worker.js');

const setUpCalculator = () => {
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
    result.value = e.data;
  }

  changeHandler();
};

const setUpColors = () => {
  const colorsWorker = new Worker('./src/colors.js');
  const colorsButton = document.getElementById('fetchColors');
  const fetchColors = () => {
    const colorsDiv = document.getElementById('colors');
    if (colorsDiv.children.length > 0) {
      const spacerLi = document.createElement('li');
      spacerLi.innerText = '-----------------';
      colorsDiv.appendChild(spacerLi);
    }
    colorsWorker.postMessage('fetchColor');
    colorsWorker.postMessage('fetchColor');
    colorsWorker.postMessage('fetchColor');
    colorsWorker.postMessage('fetchColor');
    colorsWorker.postMessage('fetchColor');
  }
  colorsButton.addEventListener('click', fetchColors);
  colorsWorker.onmessage = e => {
    // Create a new LI element with the random color text as well as a div that has that color as the background. Then add it to the list.
    const color = e.data;
    const li = document.createElement('li');
    li.innerText = color;
    const div = document.createElement('div');
    div.style.backgroundColor = color;
    div.style.width = '20px';
    div.style.height = '20px';
    div.style.display = 'inline-block';
    div.style.marginRight = '10px';
    li.prepend(div);
    document.getElementById('colors').appendChild(li);
    li.scrollIntoView(false);
  };

  fetchColors();
};

const setUpSocket = () => {
  const socket = io('http://localhost:8000');
  socket.on('connect', () => {
    console.info('Socket connected!');
  });

  socket.on('server.colorsFetched', event => {
    const colors = event.colors;
    const colorsDiv = document.getElementById('socketColors');
    const colorResult = document.createElement('div');
    colorResult.classList.add('colorResult');

    for (const color of colors) {
      const colorDiv = document.createElement('div');
      colorDiv.classList.add('color');
      colorDiv.style.backgroundColor = color;
      colorResult.appendChild(colorDiv);
    }
    colorsDiv.appendChild(colorResult);
    colorResult.scrollIntoView(false);
  })
  const fetchColors = () => {
    const randomNumberOfColors = Math.floor(Math.random() * 10) + 1;
    socket.emit('client.fetchColors', { numberToFetch: randomNumberOfColors });
  }

  const socketFetchButton = document.getElementById('fetchSocketColors');
  socketFetchButton.addEventListener('click', fetchColors);

}

window.onload = () => {
  setUpCalculator();
  setUpColors();
  setUpSocket();
}
