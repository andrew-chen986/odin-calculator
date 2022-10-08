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
    if (b === 0) {
        alert("You can't divide by 0!");
        return;
    }
    return a / b;
}

function createExpression(equation) {
    // consolidate numbers
    exp = [];
    currentNum = [];
    for (let i = 0; i < equation.length; i++) {
        if (isNaN(equation[i]) && equation[i] !== '.') {
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
    while (exp.length > 1) {
        // evaluate multiplication and divison first
        if (exp.includes('/') || exp.includes('*')) {
            const star = exp.indexOf('*');
            const slash = exp.indexOf('/');
            if (star === -1) {
                a = parseFloat(exp[slash-1]);
                b = parseFloat(exp[slash+1]);
                exp.splice(slash-1, 3, divide(a,b));
            }
            else if (slash === -1) {
                a = parseFloat(exp[star-1]);
                b = parseFloat(exp[star+1]);
                exp.splice(star-1, 3, multiply(a,b));
            }
            else if (star < slash && star >= 0) {
                a = parseFloat(exp[star-1]);
                b = parseFloat(exp[star+1]);
                exp.splice(star-1, 3, multiply(a,b));
            }
            else if (slash < star && slash >= 0) {
                a = parseFloat(exp[slash-1]);
                b = parseFloat(exp[slash+1]);
                exp.splice(slash-1, 3, divide(a,b));
            } 
        }
        else {
            if (exp.includes('+') || exp.includes('-')) {
                const plus = exp.indexOf('+');
                const minus = exp.indexOf('-');
                if (plus === -1) {
                    a = parseFloat(exp[minus-1]);
                    b = parseFloat(exp[minus+1]);
                    exp.splice(minus-1, 3, subtract(a,b));
                }
                else if (minus === -1) {
                    a = parseFloat(exp[plus-1]);
                    b = parseFloat(exp[plus+1]);
                    exp.splice(plus-1, 3, add(a,b));
                }
                else if (plus < minus && plus >= 0) {
                    a = parseFloat(exp[plus-1]);
                    b = parseFloat(exp[plus+1]);
                    exp.splice(plus-1, 3, add(a,b));
                }
                else if (minus < plus && minus >= 0) {
                    a = parseFloat(exp[minus-1]);
                    b = parseFloat(exp[minus+1]);
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
            if (!isNaN(arg)) {
                if (equation[0] === 0 && equation.length === 1) {
                    equation[0] = parseFloat(arg);
                }
                else {
                    equation.push(parseFloat(arg));
                }
                refreshDisplay(equation);
            }
            else {
                if (operators.includes(arg)) {
                    const display = document.querySelector('#display-container');
                    const prevResult = document.querySelector('#result');
                    if (prevResult !== null) {
                        equation = [prevResult.textContent];
                        display.removeChild(prevResult);
                    }
                    if (operators.includes(equation[equation.length - 1])) {
                        equation[equation.length - 1] = arg;
                    }
                    else {
                        equation.push(arg);
                    }
                    refreshDisplay(equation);
                }
                else if (arg === '=') {
                    const display = document.querySelector('#display-container');
                    const prevResult = document.querySelector('#result');
                    if (prevResult === null) {
                        if (equation.length !== 1) {
                            result = evaluate(equation);
                            if (result % 1 !== 0) {
                                result = result.toFixed(2);
                            }
                            displayResult = document.createElement('div');
                            displayResult.setAttribute('id','result');
                            displayResult.textContent = result;
                            display.appendChild(displayResult);
                        }
                    }
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
                else if (arg === '+/-') {
                    if (isNaN(equation[equation.length - 1])) {
                        // do nothing if not a number
                    }
                    else {
                        // need to check if number has a decimal
                        startIndex = equation.length - 1;
                        endIndex = 0
                        for (let i = startIndex; i >= 0; i--) {
                            // if another . is found, another . would be illegal
                            if (equation[i] == '.') {
                                foundDecimal = true; 
                            }
                            // found an operating symbol, so number is over
                            else if (isNaN(equation[i])) {
                                endIndex = i
                                break;
                            }
                        }
                        num = []
                        for (let i = endIndex; i < equation.length; i++) {
                            num.push(equation[i])
                        }
                        if (endIndex === 0) {
                            equation.splice(endIndex, num.length)
                        }
                        else {
                            equation.splice(endIndex + 1, num.length)
                        }

                        num = parseFloat(num.join("")) * -1
                        num = String(num)
                        equation.push(num)

                        const display = document.querySelector('#display-container');
                        const prevEquation = document.querySelector('#equation');
                        const prevResult = document.querySelector('#result');
                        if (prevEquation !== null) {
                            display.removeChild(prevEquation);
                        }
                        if (prevResult !== null) {
                            display.removeChild(prevResult);
                            equation = [prevResult.textContent]
                            console.log(equation)
                        }
                        refreshDisplay(equation)
                    }
                }
                else if (arg === '.') {
                    // search for another . within the same number
                    startIndex = equation.length - 1;
                    endIndex = 0
                    foundDecimal = false;
                    for (let i = startIndex; i >= 0; i--) {
                        // if another . is found, another . would be illegal
                        if (equation[i] == '.') {
                            foundDecimal = true; 
                            break;
                        }
                        // found an operating symbol, so number is over
                        else if (isNaN(equation[i])) {
                            endIndex = i
                            break;
                        }
                    }
                    if (!foundDecimal) {
                        equation.push(arg)
                        refreshDisplay(equation)
                    }
                }
            }
        });
    });
}

populateDisplay();