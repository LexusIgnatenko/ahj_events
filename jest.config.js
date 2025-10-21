// jest.config.js
module.exports = {
  testEnvironment: "jsdom", // Используем jsdom для тестировани
  moduleFileExtensions: ["js", "jsx", "json", "node"],
  transform: {
    "^.+\\.jsx?$": "babel-jest", // Если вы используете Babel
  },
};
