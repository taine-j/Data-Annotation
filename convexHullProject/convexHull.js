function calculate2DConvexHull(points) {
    // Error handling for empty or invalid inputs
    if (!points || points.length === 0) {
      throw new Error("Input points must be an array of at least one point.");
    }
  
    for (const point of points) {
      if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
        throw new Error("Points must have valid numeric coordinates.");
      }
    }
  
    // Find the leftmost point with the lowest y-coordinate (or lowest x-coordinate for ties)
    let leftmost = points[0];
    for (let i = 1; i < points.length; i++) {
      if (points[i].y < leftmost.y || (points[i].y === leftmost.y && points[i].x < leftmost.x)) {
        leftmost = points[i];
      }
    }
  
    // Sort points by polar angle relative to leftmost point
    points.sort((p1, p2) => {
      const angle1 = Math.atan2(p1.y - leftmost.y, p1.x - leftmost.x);
      const angle2 = Math.atan2(p2.y - leftmost.y, p2.x - leftmost.x);
      return angle1 - angle2;
    });
  
    // Initialize stack with leftmost and next point
    const stack = [leftmost, points[1]];
  
    // Iterate through remaining points
    for (let i = 2; i < points.length; i++) {
      const current = points[i];
      // Remove points forming right turns
      while (stack.length >= 2 && orientation(stack[stack.length - 2], stack[stack.length - 1], current) < 0) {
        stack.pop();
      }
      // Add current point to stack
      stack.push(current);
    }
  
    // Return convex hull points
    return stack;
  }
  
  // Function to check the orientation of three points (counter-clockwise, clockwise, or collinear)
  function orientation(p1, p2, p3) {
    const val = (p2.y - p1.y) * (p3.x - p2.x) - (p2.x - p1.x) * (p3.y - p2.y);
    return (val === 0) ? 0 : (val > 0) ? 1 : -1;
  }
  
  module.exports = { calculate2DConvexHull };