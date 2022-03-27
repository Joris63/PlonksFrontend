/* eslint-disable no-useless-escape */

function IsElementOffscreen(el) {
  const rect = el?.getBoundingClientRect();

  const res = `${rect.x < 0 ? "left" : ""} ${rect.y < 0 ? "up" : ""} ${
    rect.x + rect.width > window.innerWidth ? "right" : ""
  } ${rect.y + rect.height > window.innerHeight ? "down" : ""}`;

  return res;
}

function TurnStringToCamelCase(string) {
  const words = string.split(" ").map((word, index) => {
    let newWord = word;

    if (/[/]+/.test(word)) {
      newWord = word
        .split("/")
        .map((w) => (w = w[0].toUpperCase() + w.substr(1)))
        .join("Or");
    }

    if (/[-]+/.test(word)) {
      newWord = word
        .split("-")
        .map((w) => (w = w[0].toUpperCase() + w.substr(1)))
        .join("");
    }

    if (index === 0) {
      newWord = newWord = newWord[0].toLowerCase() + newWord.substr(1);
    } else {
      newWord = newWord = newWord[0].toUpperCase() + newWord.substr(1);
    }

    return newWord;
  });

  return words.join("");
}

function CheckForNumberInString(string) {
  return /\d/.test(string);
}

function CheckForCapsInString(string) {
  return [...string].some((character) => /^[A-Z]*$/.test(character));
}

function CheckLengthInString(string, minLength = 0) {
  return string.length >= minLength;
}

function CheckForBadCharacters(string) {
  return [...string].some(
    (character) => /^\s*$/.test(character) || /['||"]/.test(character)
  );
}

function ValidateEmail(email) {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
}

export {
  IsElementOffscreen,
  TurnStringToCamelCase,
  CheckForNumberInString,
  CheckForCapsInString,
  CheckLengthInString,
  CheckForBadCharacters,
  ValidateEmail,
};
