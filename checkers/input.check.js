const stringChecker = /^[A-Za-z ]+$/;
const numberChecker = /^\d+$/;
const emailChecker = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const checkInputIsString = (input) => {
    if(!input.match(stringChecker)) return false;
    return true;
};
const checkInputIsNumber = (input) => {
    if(!input.toString().match(numberChecker)) return false;
    return true;
};
const checkInputIsValidEmail = (input) => {
    if(!input.match(emailChecker)) return false;
    return true;
};

module.exports = {
    checkInputIsString,
    checkInputIsNumber,
    checkInputIsValidEmail
};