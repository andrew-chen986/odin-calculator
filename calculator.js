function add (a,b) {
    return a + b;
}

function subtract (a,b) {
    return a - b;
}

function multiply (a,b) {
    return a * b;
}

function divide (a,b) {
    return a / b;
}

function createExpression(equation) {
    // consolidate numbers
    exp = [];
    currentNum = [];
    for (let i = 0; i < equation.length; i++) {
        if (isNaN(equation[i])) {
            // number is complete, add to expression and clear array
            exp.push(currentNum.join(""));
            exp.push(equation[i]);
            currentNum = [];
        }
        else {
            currentNum.push(equation[i]);
        }
    }
    exp.push(currentNum.join(""));
    return exp;
}

function evaluate(equation) {
    exp = createExpression(equation);
    console.log(exp);
    while (exp.length > 1) {
        // evaluate multiplication and divison first
        if (exp.includes('/') || exp.includes('*')) {
            const star = exp.indexOf('*');
            const slash = exp.indexOf('/');
            if (star === -1) {
                a = parseInt(exp[slash-1]);
                b = parseInt(exp[slash+1]);
                exp.splice(slash-1, 3, divide(a,b));
            }
            else if (slash === -1) {
                a = parseInt(exp[star-1]);
                b = parseInt(exp[star+1]);
                exp.splice(star-1, 3, multiply(a,b));
            }
            else if (star < slash && star >= 0) {
                a = parseInt(exp[star-1]);
                b = parseInt(exp[star+1]);
                exp.splice(star-1, 3, multiply(a,b));
            }
            else if (slash < star && slash >= 0) {
                a = parseInt(exp[slash-1]);
                b = parseInt(exp[slash+1]);
                exp.splice(slash-1, 3, divide(a,b));
            } 
        }
        else {
            if (exp.includes('+') || exp.includes('-')) {
                const plus = exp.indexOf('+');
                const minus = exp.indexOf('-');
                if (plus === -1) {
                    a = parseInt(exp[minus-1]);
                    b = parseInt(exp[minus+1]);
                    exp.splice(minus-1, 3, subtract(a,b));
                }
                else if (minus === -1) {
                    a = parseInt(exp[plus-1]);
                    b = parseInt(exp[plus+1]);
                    exp.splice(plus-1, 3, add(a,b));
                }
                else if (plus < minus && plus >= 0) {
                    a = parseInt(exp[plus-1]);
                    b = parseInt(exp[plus+1]);
                    exp.splice(plus-1, 3, add(a,b));
                }
                else if (minus < plus && minus >= 0) {
                    a = parseInt(exp[minus-1]);
                    b = parseInt(exp[minus+1]);
                    exp.splice(minus-1, 3, subtract(a,b));
                } 
            }

        }
    }
    return exp[0];
}

function refreshDisplay(equation) {
    // refresh equation
    const output = equation.join("");
    const display = document.querySelector('#display-container');
    const prevEquation = document.querySelector('#equation');
    if (prevEquation !== null) {
        display.removeChild(prevEquation)
    }

    const newEquation = document.createElement('div');
    newEquation.setAttribute('id','equation');
    newEquation.textContent = output;
    display.appendChild(newEquation);
}

function populateDisplay() {
    let equation = [0];
    let result = 0;
    const operators = ['+', '-', '*', '/'];
    refreshDisplay(equation);
    buttons = document.querySelectorAll('button');
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            arg = button.textContent;
            console.log(arg);
            if (!isNaN(arg)) {
                if (equation[0] === 0 && equation.length === 1) {
                    equation[0] = parseInt(arg);
                }
                else {
                    equation.push(parseInt(arg));
                }
                refreshDisplay(equation);
            }
            else {
                if (operators.includes(arg)) {
                    if (operators.includes(equation[equation.length - 1])) {
                        equation[equation.length - 1] = arg;
                    }
                    else {
                        equation.push(arg);
                    }
                    refreshDisplay(equation);
                }
                else if (arg === '=') {
                    result = evaluate(equation);
                    console.log(result);
                    displayResult = document.createElement('div');
                    displayResult.setAttribute('id','result');
                    displayResult.textContent = result;
                    const display = document.querySelector('#display-container');
                    display.appendChild(displayResult);
                }
                else if (arg === 'C') {
                    equation.pop();
                    if (equation.length == 0) {
                        equation.push(0);
                    }
                    const display = document.querySelector('#display-container');
                    const prevResult = document.querySelector('#result');
                    if (prevResult !== null) {
                        display.removeChild(prevResult);
                    }
                    refreshDisplay(equation);
                }
                else if (arg === 'AC') {
                    equation = [0];
                    const display = document.querySelector('#display-container');
                    const prevEquation = document.querySelector('#equation');
                    const prevResult = document.querySelector('#result');
                    if (prevEquation !== null) {
                        display.removeChild(prevEquation);
                    }
                    if (prevResult !== null) {
                        display.removeChild(prevResult);
                    }
                    refreshDisplay(equation);
                }
            }
        });
    });
}

populateDisplay();