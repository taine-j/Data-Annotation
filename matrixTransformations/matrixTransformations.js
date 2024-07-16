// Transformation functions

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const addTwo = async (matrix) => {
  console.log("Starting 'add two' transformation");
  await delay(2000); // Simulated delay
  const newMatrix = matrix.map((row) => row.map((cell) => cell + 2));
  console.log("'Add two' transformation complete");
  return newMatrix;
};

const multiplyByThree = async (matrix) => {
  console.log("Starting 'multiply by three' transformation");
  await delay(3000); // Simulated delay
  const newMatrix = matrix.map((row) => row.map((cell) => cell * 3));
  console.log("'Multiply by three' transformation complete");
  return newMatrix;
};

const subtractOne = async (matrix) => {
  console.log("Starting 'subtract one' transformation");
  await delay(1000); // Simulated delay
  const newMatrix = matrix.map((row) => row.map((cell) => cell - 1));
  console.log("'Subtract one' transformation complete");
  return newMatrix;
};

// Matrix transformation module

const transformMatrix = async (initialMatrix, transformations) => {
  try {
    let transformedMatrix = initialMatrix;

    for (const transformation of transformations) {
      transformedMatrix = await transformation(transformedMatrix);
    }

    console.log("Initial matrix:");
    console.log(initialMatrix);
    console.log("Final transformed matrix:");
    console.log(transformedMatrix);

    return transformedMatrix;
  } catch (error) {
    console.error(`Transformation failed: ${error.message}`);
  }
};

// Example usage

const initialMatrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

transformMatrix(initialMatrix, [addTwo, multiplyByThree, subtractOne]);

module.exports = {
    addTwo,
    multiplyByThree,
    subtractOne,
    transformMatrix
  };