function eval() {
  // Do not use eval!!!
  return;
}

function expressionCalculator(expr) {
  let clearExpr = ''; // expression with spaces between items
  let exprItems = []; // array with expression items
  const openBrackets = []; // array with positions of open brackets
  let lastOpenBracket; // position of the last open bracket
  let closedBracket; // position of a closed bracket

  // checks if brackets are pair
  function checkBrackets(exprItems) {
    let counter = 0;
    for (let i = 0, n = exprItems.length - 1; i <= n; i++) {
      switch (exprItems[i]) {
      case '(':
        counter++;
        break;
      case ')':
        counter--;
        break;
      }
    }
    if (counter) {
      throw 'ExpressionError: Brackets must be paired';
    }
  }

  // executes simple expressions
  function doSimpleExpr(a, operator, b) {
    switch (operator) {
    case '+':
      return +a + +b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      if (!+b) {
        throw 'TypeError: Division by zero.';
      }
      return a / b;
    }
  }

  // changes the expression to its result
  function doAndFoget(exprItems, i) {
    exprItems[i - 1] =
      doSimpleExpr(exprItems[i - 1], exprItems[i], exprItems[i + 1]);
    exprItems.splice(i, 2);
  }

  // executes the expression in brackets: division both multiplication at first then addition and subtraction
  function doExprInBrackets(exprItems, start, end) {
    let i = start;
    let n = end;
    while (i <= n) {
      switch (exprItems[i]) {
      case '/':
      case '*':
        doAndFoget(exprItems, i);
        n -= 2;
        break;
      default:
        i++;
      }
    }

    i = start + 2;
    while (i < n) {
      doAndFoget(exprItems, i);
      n -= 2;
    }

    return exprItems[start + 1];
  }

  clearExpr = expr
    .replace(/\s/g, '')
    .replace(/[/*\-+]/g, ' $& ')
    .replace(/\(/g, '( ')
    .replace(/\)/g, ' )');
  exprItems = clearExpr.split(/\s/);
  exprItems.unshift('(');
  exprItems.push(')');

  checkBrackets(exprItems);

  let i = 0;
  let n = exprItems.length - 1;
  while (i <= n) {
    switch (exprItems[i]) {
    case '(':
      openBrackets.push(i);
      i++;
      break;
    case ')':
      closedBracket = i;
      lastOpenBracket = openBrackets[openBrackets.length - 1];
      exprItems[lastOpenBracket] =
          doExprInBrackets(exprItems, lastOpenBracket, closedBracket);
      exprItems.splice(lastOpenBracket + 1, 2);
      openBrackets.pop();
      i = lastOpenBracket + 1;
      n = exprItems.length - 1;
      break;
    default:
      i++;
    }
  }

  return exprItems[0];
}

module.exports = {
  expressionCalculator
};
