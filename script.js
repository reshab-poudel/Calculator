const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let currentInput = "0";
let previousInput = null;
let operator = null;
let shouldResetDisplay = false;

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  const asString = String(value);
  if (asString.length <= 12) {
    return asString;
  }

  return value.toExponential(6);
}

function updateDisplay() {
  display.textContent = currentInput;
}

function inputNumber(number) {
  if (shouldResetDisplay) {
    currentInput = number;
    shouldResetDisplay = false;
    updateDisplay();
    return;
  }

  currentInput = currentInput === "0" ? number : currentInput + number;
  updateDisplay();
}

function inputDecimal() {
  if (shouldResetDisplay) {
    currentInput = "0.";
    shouldResetDisplay = false;
    updateDisplay();
    return;
  }

  if (!currentInput.includes(".")) {
    currentInput += ".";
    updateDisplay();
  }
}

function clearAll() {
  currentInput = "0";
  previousInput = null;
  operator = null;
  shouldResetDisplay = false;
  updateDisplay();
}

function deleteLast() {
  if (shouldResetDisplay) {
    return;
  }

  currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
  updateDisplay();
}

function toggleSign() {
  if (currentInput === "0" || currentInput === "Error") {
    return;
  }

  currentInput = currentInput.startsWith("-")
    ? currentInput.slice(1)
    : `-${currentInput}`;
  updateDisplay();
}

function compute(a, b, op) {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b === 0 ? NaN : a / b;
    default:
      return b;
  }
}

function chooseOperator(nextOperator) {
  if (currentInput === "Error") {
    return;
  }

  if (operator && !shouldResetDisplay) {
    evaluate();
  }

  previousInput = Number(currentInput);
  operator = nextOperator;
  shouldResetDisplay = true;
}

function evaluate() {
  if (operator === null || previousInput === null) {
    return;
  }

  const current = Number(currentInput);
  const result = compute(previousInput, current, operator);

  currentInput = formatNumber(result);
  previousInput = Number.isFinite(result) ? Number(result) : null;
  operator = null;
  shouldResetDisplay = true;
  updateDisplay();
}

function handleAction(action, value) {
  if (action === "number") {
    inputNumber(value);
    return;
  }

  if (action === "decimal") {
    inputDecimal();
    return;
  }

  if (action === "clear") {
    clearAll();
    return;
  }

  if (action === "delete") {
    deleteLast();
    return;
  }

  if (action === "sign") {
    toggleSign();
    return;
  }

  if (action === "operator") {
    chooseOperator(value);
    return;
  }

  if (action === "equals") {
    evaluate();
  }
}

buttons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const value = button.dataset.value;
  handleAction(action, value);
});

document.addEventListener("keydown", (event) => {
  const { key } = event;

  if (/\d/.test(key)) {
    inputNumber(key);
    return;
  }

  if (key === ".") {
    inputDecimal();
    return;
  }

  if (["+", "-", "*", "/"].includes(key)) {
    chooseOperator(key);
    return;
  }

  if (key === "Enter" || key === "=") {
    event.preventDefault();
    evaluate();
    return;
  }

  if (key === "Backspace") {
    deleteLast();
    return;
  }

  if (key === "Escape") {
    clearAll();
  }
});

updateDisplay();
