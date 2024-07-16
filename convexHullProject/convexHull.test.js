const { calculate2DConvexHull } = require('./convexHull.js'); // Assuming convex_hull.js contains the function

describe('calculate2DConvexHull', () => {
  it('should throw an error for empty or invalid input', () => {
    expect(() => calculate2DConvexHull()).toThrowError("Input points must be an array of at least one point.");
    expect(() => calculate2DConvexHull([])).toThrowError("Input points must be an array of at least one point.");
    expect(() => calculate2DConvexHull(null)).toThrowError("Input points must be an array of at least one point.");
    expect(() => calculate2DConvexHull([{}])).toThrowError("Points must have valid numeric coordinates.");
    expect(() => calculate2DConvexHull([{ x: 0 }])).toThrowError("Points must have valid numeric coordinates.");
    expect(() => calculate2DConvexHull([{ y: 0 }])).toThrowError("Points must have valid numeric coordinates.");
    expect(() => calculate2DConvexHull([{ x: Infinity, y: 0 }])).toThrowError("Points must have valid numeric coordinates.");
    expect(() => calculate2DConvexHull([{ x: 0, y: NaN }])).toThrowError("Points must have valid numeric coordinates.");
  });

  it('should return the correct convex hull for a single point', () => {
    const points = [{ x: 0, y: 0 }];
    const expectedHull = [{ x: 0, y: 0 }];
    expect(calculate2DConvexHull(points)).toEqual(expectedHull);
  });

  it('should return the correct convex hull for two points', () => {
    const points = [{ x: 0, y: 0 }, { x: 1, y: 1 }];
    const expectedHull = [{ x: 0, y: 0 }, { x: 1, y: 1 }];
    expect(calculate2DConvexHull(points)).toEqual(expectedHull);
  });

  it('should return the correct convex hull for a triangle', () => {
    const points = [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 0 }];
    const expectedHull = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }];
    expect(calculate2DConvexHull(points)).toEqual(expectedHull);
  });

  it('should return the correct convex hull for a square', () => {
    const points = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }];
    const expectedHull = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }];
    expect(calculate2DConvexHull(points)).toEqual(expectedHull);
  });

  it('should return the correct convex hull for a set of points with some inside the hull', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
      { x: 0.5, y: 0.5 },
    ];
    const expectedHull = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }];
    expect(calculate2DConvexHull(points)).toEqual(expectedHull);
  });

  it('should return the correct convex hull for a set of collinear points', () => {
    const points = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }];
    const expectedHull = [{ x: 0, y: 0 }, { x: 2, y: 0 }];
    expect(calculate2DConvexHull(points)).toEqual(expectedHull);
  });

  it('should return the correct convex hull for a complex set of points', () => {
    const points = [
      { x: 0, y: 3 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 4, y: 4 },
      { x: 0, y: 0 },
      { x: 3, y: 0 },
      { x: 1, y: 4 },
    ];
    const expectedHull = [
      { x: 0, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 4 },
      { x: 1, y: 4 },
      { x: 0, y: 3 },
    ];
    expect(calculate2DConvexHull(points)).toEqual(expectedHull);
  });
});