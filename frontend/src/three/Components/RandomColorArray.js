// Generate an array of 10 random RGB colors that are maximally different from each other
function getRandomColorArray(numColors) {
    const colorArray = [];
    const minDist = 100; // Minimum color distance

    // Helper function to calculate CIE76 color distance between two colors
    function colorDistance(c1, c2) {
      const r1 = c1[0], g1 = c1[1], b1 = c1[2];
      const r2 = c2[0], g2 = c2[1], b2 = c2[2];
      return Math.sqrt((r2-r1)**2 + (g2-g1)**2 + (b2-b1)**2);
    }

    // Generate random colors until we have enough
    while (colorArray.length < numColors) {
      const color = [Math.floor(Math.random()*256), Math.floor(Math.random()*256), Math.floor(Math.random()*256)];

      // Check distance to all existing colors
      const dists = colorArray.map(c => colorDistance(color, c));
      if (Math.min(...dists) > minDist) {
        colorArray.push(color);
      }
    }

    return colorArray;
  }
  export { getRandomColorArray };


