const { transformMatrix, addTwo, multiplyByThree, subtractOne } = require('./matrixTransformations.js'); // Adjust the path to where the functions are exported

describe('Matrix Transformations', () => {
  test('transforms a matrix correctly through all stages', async () => {
    const initialMatrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const expectedMatrix = [
      [8, 11, 14],
      [17, 20, 23],
      [26, 29, 32],
    ];
    const transformations = [addTwo, multiplyByThree, subtractOne];
    const result = await transformMatrix(initialMatrix, transformations);
    expect(result).toEqual(expectedMatrix);
  }, 10000);

  test('handles transformation errors correctly', async () => {
    const initialMatrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 'error'],
    ];
    const transformations = [addTwo, multiplyByThree, subtractOne];
    await expect(transformMatrix(initialMatrix, transformations)).rejects.toThrow();
  }, 10000);
});