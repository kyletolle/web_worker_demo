onmessage = e => {
  const number1 = parseInt(e.data[0], 10);
  const number2 = parseInt(e.data[1], 10);
  const calculation = e.data[2];
  const calculator = new Calculator();

  let workerResult = 0;
  switch (calculation) {
    case 'add':
      workerResult = calculator.add(number1, number2);
      break;
    case 'subtract':
      workerResult = calculator.subtract(number1, number2);
      break;
    case 'multiply':
      workerResult = calculator.multiply(number1, number2);
      break;
    case 'divide':
      workerResult = calculator.divide(number1, number2);
      break;
    default:
      throw new Error('Invalid calculation');
  }
  postMessage(workerResult);
}

class Calculator {
  constructor() {
  }

  add(a, b) {
    return a + b;
  }

  subtract(a, b) {
    return a - b;
  }

  multiply(a, b) {
    return a * b;
  }

  divide(a, b) {
    return a / b;
  }
}
