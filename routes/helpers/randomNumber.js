module.exports = randomNumber = (max, min) =>
  Math.floor(Math.random() * max - min) + min;
