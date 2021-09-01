const wrapper = document.querySelector(".wrapper");
const displayOutput = document.querySelector(".display-text");
const displayOperator = document.querySelector(".display-operator");
const triggeredAchievements = [];
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
    
    if (operandB === 0 && operator == "/") {
      snarkyMsg("Tried to divide by zero");
      operatingStack.splice(0, operatingStack.length);
      displayOperator.classList.add("hidden");
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
  } else if (currentNumber.includes(".") && e.target.textContent === ".") {
    return;
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
  if (operator !== "%") {
    displayOperator.textContent = e.target.textContent;
    displayOperator.classList.remove("hidden");
  }
  newNumber = true;
  evaluateStack();
}));

const clearEntry = document.getElementById("clear-entry")
clearEntry.addEventListener("click", () => {
  currentNumber = "";
  
  if (newNumber) {
    displayOutput.textContent = 0;
    operatingStack.splice(0, operatingStack.length);
    displayOperator.classList.add("hidden");
  } else {
    newNumber = true;
    if (operatingStack.length >= 1) {
      displayOutput.textContent = operatingStack[0];
    } else {
      displayOutput.textContent = 0;
    }
  }
})

const clearAll = document.getElementById("clear-all")
clearAll.addEventListener("click", () => {
  currentNumber = "";
  displayOutput.textContent = 0;
  displayOperator.classList.add("hidden");
  operatingStack.splice(0, operatingStack.length);
})

function snarkyMsg(msg) {
  if (triggeredAchievements.includes(msg)) return;
  triggeredAchievements.push(msg);

  const container = document.createElement("div");
  container.classList.add("snarky-message")

  const achievement = document.createElement("span");
  achievement.classList.add("title");
  achievement.textContent = "Achievement unlocked";
  const message = document.createElement("span");
  message.textContent = msg;

  container.append(achievement);
  container.append(message);
  container.classList.add("hidden");
  wrapper.append(container)
  setTimeout(() => {
    container.classList.remove("hidden");
  }, 300);
  
  setTimeout(() => {
    container.classList.add("hidden");
    container.addEventListener("animationend", () => {
      container.remove();
    });
  }, 8000);
}
