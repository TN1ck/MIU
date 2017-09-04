function log(message) {
  console.log(message);
}

function warn(message) {
  console.warn(message);
}

function decision(decisions, callback) {
  return [decisions, callback];
}

// xI => xIU
function ruleOne(string) {
  const lastLetter = string[string.length - 1];

  if (lastLetter !== 'I') {
    warn('This rule is not allowed, the string did not have an I as the last letter.');
    return string;
  }

  return string + 'U';
}

// Mx => Mxx
function ruleTwo(string) {
  const [firstLetter] = string[0];
  if (firstLetter !== 'M') {
    warn('This rule is not allowed, the string did not start with an M');
    return string;
  }

  if (string.length < 2) {
    warn('This rule cannot be applied, as there is no content to repeat');
    return string;
  }

  return firstLetter + string.slice(1) + string.slice(1);

}


// III => U
function ruleThree(string) {
  const IIIPlaces = [];

  let temp = string.slice(0, 3);
  let index = 0;
  for (const s of string.slice(3)) {
    if (temp === 'III') {
      IIIPlaces.push(index);
    }
    temp = temp.slice(1, 3) + s;
    index++;
  }
  if (temp === 'III') {
    IIIPlaces.push(index);
  }
  return decision(IIIPlaces, index => {
    return string.slice(0, index) + 'U' + string.slice(index + 3);
  });
}

// UU => ''
function ruleFour(string) {
  const UUPlaces = [];
  
  let temp = string.slice(0, 2);
  let index = 0;
  for (const s of string.slice(2)) {
    if (temp === 'UU') {
      UUPlaces.push(index);
    }
    temp = temp.slice(1, 2) + s;
    index++;
  }
  if (temp === 'UU') {
    UUPlaces.push(index);
  }
  return decision(UUPlaces, index => {
    return string.slice(0, index) + string.slice(index + 2);
  });
}

const START_STRING = 'MI';
let currentString = START_STRING;

function renderGame() {

  const ruleOneButton = document.getElementById('ruleOne');
  const ruleTwoButton = document.getElementById('ruleTwo');
  const ruleThreeButton = document.getElementById('ruleThree');
  const ruleFourButton = document.getElementById('ruleFour');
  const resetButton = document.getElementById('reset');
  const result = document.getElementById('result');

  result.innerHTML = currentString;

  function applyRule(string, rule, resultCallback) {
    const result = rule(string);
    // we got a decision
    if (typeof result === 'object') {
      const decisions = result[0];
      const callback = result[1];
      if (decisions.length === 0) {
        warn('This rule cannot be applied, as there are no options.');
        return resultCallback(string);
      }
      const answer = window.prompt(`
For this rule you must find a decision, how do you want to apply this rule?

${decisions.map((d, i) => {
  return i + '. ' + string + ' => ' + callback(d);
}).join('\n')}

Please enter a valid number to apply the rule.
      `, '0')

      const parsedAnswer = Number.parseInt(answer);
      if (decisions[parsedAnswer] !== undefined) {
        return resultCallback(callback(decisions[parsedAnswer]));
      }
      return resultCallback(string);
    }
    return resultCallback(result);
  }

  function resultCallback(string) {
    log('Applied rule and now have ' + string);
    currentString = string;
    renderGame();
  }

  ruleOneButton.onclick = () => {
    applyRule(currentString, ruleOne, resultCallback);
  }

  ruleTwoButton.onclick = () => {
    applyRule(currentString, ruleTwo, resultCallback);
  }

  ruleThreeButton.onclick = () => {
    applyRule(currentString, ruleThree, resultCallback);
  }

  ruleFourButton.onclick = () => {
    applyRule(currentString, ruleFour, resultCallback);
  }

  resetButton.onclick = () => {
    currentString = START_STRING;
    renderGame();
  }

}

renderGame();