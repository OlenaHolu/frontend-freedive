export const calculateCorrelation = (x, y) => {
    const n = x.length;
    if (n !== y.length || n === 0) return 0;
  
    const avgX = x.reduce((a, b) => a + b, 0) / n;
    const avgY = y.reduce((a, b) => a + b, 0) / n;
  
    const numerator = x.reduce((sum, xi, i) => sum + (xi - avgX) * (y[i] - avgY), 0);
    const denominator = Math.sqrt(
      x.reduce((sum, xi) => sum + (xi - avgX) ** 2, 0) *
      y.reduce((sum, yi) => sum + (yi - avgY) ** 2, 0)
    );
  
    return denominator === 0 ? 0 : numerator / denominator;
  };
  