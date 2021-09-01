const displayOutput = document.querySelector(".display-text")
let currentNumber = "";
let newNumber = false;
const operatingStack = [];
const possibleOperators = {
  "+": "+",
  "−": "-",
  "×": "*",
  "÷": "/",
  "%": "%",
  "=": "="
}

function evaluateStack() {
  if (operatingStack.slice(-1) == "%") {

    operatingStack.pop();
    const operand = operatingStack.pop();
    const result = percent(operand)
    operatingStack.push(result);
    displayOutput.textContent = result;

  } else if (operatingStack.length >= 4) {
    
    const nextOperator = operatingStack.pop();
    const operandB = operatingStack.pop();
    const operator = operatingStack.pop();
    const operandA = operatingStack.pop();
    const result = operate(operator, operandA, operandB);
    operatingStack.push(result);
    displayOutput.textContent = result;

    if (nextOperator !== "="){
      operatingStack.push(nextOperator);
    }

  }
  console.log(operatingStack);
}

const numberBtns = document.querySelectorAll(".btn.number")
numberBtns.forEach(btn => btn.addEventListener("click", e => {
  if (newNumber) {
    currentNumber = "";
  }
  if (newNumber && typeof operatingStack.slice(-1)[0] === "number") {
    operatingStack.pop();
  }
  if (currentNumber === "" && e.target.textContent === ".") {
    currentNumber = "0";
  }
  currentNumber += e.target.textContent;
  newNumber = false;
  displayOutput.textContent = currentNumber;
}));

const operatorBtns = document.querySelectorAll(".btn.operator")
operatorBtns.forEach(btn => btn.addEventListener("click", e => {
  if (!newNumber) {
    operatingStack.push(Number(currentNumber));
  }
  const operator = possibleOperators[e.target.textContent]
  if (Object.values(possibleOperators).includes(operatingStack.slice(-1)[0])) {
    operatingStack.splice(-1, 1, operator)
  } else if (operator !== "=" || operatingStack.length >= 3) {
    operatingStack.push(operator);
  }
  newNumber = true;
  evaluateStack();
}))
