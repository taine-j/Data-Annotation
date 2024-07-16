// utils/dbConnect.js
module.exports = () => {
  return new Promise((resolve, reject) => {
    // Simulate a successful connection after 500 milliseconds
    setTimeout(() => {
      resolve();
    }, 500);
  });
};