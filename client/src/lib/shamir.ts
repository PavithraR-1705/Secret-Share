// Helper to convert any base value string to BigInt
export function convertToDecimal(value: string, base: number): bigint {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  let result = 0n;
  const b = BigInt(base);
  
  for (let i = 0; i < value.length; i++) {
    const char = value[i].toLowerCase();
    const digit = BigInt(chars.indexOf(char));
    if (digit === -1n || digit >= b) {
      throw new Error(`Invalid character '${char}' for base ${base}`);
    }
    result = result * b + digit;
  }
  
  return result;
}

// Lagrange Interpolation to find f(0)
export function findSecret(points: Array<{ x: number; y: bigint }>, k: number): bigint {
  let secret = 0n;

  // Use only the first k points
  const usedPoints = points.slice(0, k);

  for (let i = 0; i < k; i++) {
    const xi = BigInt(usedPoints[i].x);
    const yi = usedPoints[i].y;

    let numerator = 1n;
    let denominator = 1n;

    for (let j = 0; j < k; j++) {
      if (i !== j) {
        const xj = BigInt(usedPoints[j].x);
        numerator = numerator * (-xj);
        denominator = denominator * (xi - xj);
      }
    }

    // Multiply fully first
    let term = yi * numerator;

    // Then divide
    term = term / denominator;

    secret = secret + term;
  }

  // Ensure positive output just in case
  return secret >= 0n ? secret : -secret;
}

// Main solve function matching the Java structure
export function solve(jsonInput: string): { secret: string; points: Array<{x: number, y: string, base: number, rawValue: string}> } {
  const obj = JSON.parse(jsonInput);
  
  if (!obj.keys || typeof obj.keys.k !== 'number') {
    throw new Error("Invalid JSON: Missing 'keys.k' parameter");
  }

  const k = obj.keys.k;
  const points: Array<{ x: number; y: bigint; base: number; rawValue: string }> = [];

  for (const key in obj) {
    if (key !== "keys" && Object.prototype.hasOwnProperty.call(obj, key)) {
      const x = parseInt(key, 10);
      if (isNaN(x)) continue;

      const root = obj[key];
      const base = parseInt(root.base, 10);
      const value = root.value;

      const y = convertToDecimal(value, base);
      points.push({ x, y, base, rawValue: value });
    }
  }

  // Sort x values
  points.sort((a, b) => a.x - b.x);

  if (points.length < k) {
    throw new Error(`Not enough points provided. Need at least k=${k}, got ${points.length}`);
  }

  const secret = findSecret(points, k);
  
  return { 
    secret: secret.toString(),
    points: points.map(p => ({
      x: p.x,
      y: p.y.toString(),
      base: p.base,
      rawValue: p.rawValue
    }))
  };
}