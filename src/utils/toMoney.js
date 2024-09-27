
function toMoney(number) {
    if (!number) {
      return "0";
    }
    let result = "";
    for (let i = 0; i < number.toString().length; i++) {
      result += number.toString()[i];
      if ((number.toString().length - i) % 3 == 1) {
        result += " ";
      }
    }
    return result;
  }
  
module.exports = toMoney