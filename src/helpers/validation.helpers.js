/* eslint-disable no-useless-escape */
function CheckForQuotes(string) {
  return /['||"]/.test(string);
}

function CheckForWhiteSpaces(string) {
  return /\s/.test(string);
}

function CheckForUppercase(string) {
  return /^(?=.*[A-Z]).*$/.test(string);
}

function CheckForLowercase(string) {
  return /^(?=.*[a-z]).*$/.test(string);
}

function CheckForNumber(string) {
  return /^(?=.*[0-9]).*$/.test(string);
}

function CheckForSymbols(string) {
  return /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/.test(string);
}

function CheckMinLength(string, minLength = 1) {
  return string.length >= minLength;
}

function CheckMaxLength(string, maxLength = 100) {
  return string.length <= maxLength;
}

function CheckEmail(email) {
  return email?.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
}

function CheckField(field) {
  if (field?.value === "" && !field?.optional) {
    return "Field is required.";
  }

  if (CheckForQuotes(field?.value)) {
    return "Field must not contain quotes.";
  }

  if (!field?.whitespaces && CheckForWhiteSpaces(field?.value)) {
    return "Field must not contain whitespaces.";
  }

  if (field?.requiresUpper && !CheckForUppercase(field?.value)) {
    return "Field must have at least one uppercase character.";
  }

  if (field?.requiresLower && !CheckForLowercase(field?.value)) {
    return "Field must have at least one lowercase character.";
  }

  if (field?.requiresNr && !CheckForNumber(field?.value)) {
    return "Field must contain at least one digit.";
  }

  if (field?.requiresSymbol && !CheckForSymbols(field?.value)) {
    return "Field must contain at least one Special symbol.";
  }

  if (field?.minLength && !CheckMinLength(field?.value, field?.minLength)) {
    return `Field must be longer than ${field?.minLength} characters.`;
  }

  if (field?.maxLength && !CheckMaxLength(field?.value)) {
    return `Field must not be longer than ${field?.maxlength} characters.`;
  }

  return null;
}

export {
  CheckForQuotes,
  CheckForWhiteSpaces,
  CheckForLowercase,
  CheckForUppercase,
  CheckForNumber,
  CheckForSymbols,
  CheckMinLength,
  CheckMaxLength,
  CheckEmail,
  CheckField,
};
