module.exports = removeParanthesisContent = (text) =>
  text.indexOf("(") !== -1 ? text.slice(0, text.indexOf("(")) : text;
